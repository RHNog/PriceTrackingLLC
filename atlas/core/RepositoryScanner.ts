import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

export type RepositorySection =
  | "providers"
  | "engines"
  | "components"
  | "documentation"
  | "tests";

export type RepositoryFileSummary = {
  extension: string;
  path: string;
  sizeBytes: number;
};

export type RepositorySummary = {
  generatedAt: string;
  repositoryRoot: string;
  totals: {
    components: number;
    documentation: number;
    engines: number;
    files: number;
    providers: number;
    tests: number;
  };
  sections: Record<RepositorySection, RepositoryFileSummary[]>;
};

const ignoredDirectories = new Set([
  ".git",
  ".next",
  "node_modules",
]);

const sectionMatchers: Record<RepositorySection, (path: string) => boolean> = {
  providers: (path) => path.startsWith("lib/providers/"),
  engines: (path) => path.startsWith("lib/engines/"),
  components: (path) =>
    path.startsWith("components/") || path.startsWith("features/"),
  documentation: (path) =>
    path.startsWith("docs/") ||
    path.startsWith("atlas/") ||
    path.endsWith(".md"),
  tests: (path) => path.startsWith("tests/") || path.endsWith(".test.ts"),
};

function isIgnoredDirectory(name: string) {
  return ignoredDirectories.has(name);
}

function getExtension(path: string) {
  const lastDot = path.lastIndexOf(".");

  return lastDot >= 0 ? path.slice(lastDot) : "none";
}

function scanFiles(root: string, currentDirectory = root): RepositoryFileSummary[] {
  const entries = readdirSync(currentDirectory, { withFileTypes: true });
  const files: RepositoryFileSummary[] = [];

  entries.forEach((entry) => {
    if (entry.isDirectory() && isIgnoredDirectory(entry.name)) {
      return;
    }

    const absolutePath = join(currentDirectory, entry.name);

    if (entry.isDirectory()) {
      files.push(...scanFiles(root, absolutePath));
      return;
    }

    if (!entry.isFile()) {
      return;
    }

    const relativePath = relative(root, absolutePath).replaceAll("\\", "/");
    const stats = statSync(absolutePath);

    files.push({
      extension: getExtension(relativePath),
      path: relativePath,
      sizeBytes: stats.size,
    });
  });

  return files.sort((a, b) => a.path.localeCompare(b.path));
}

function createEmptySections(): Record<RepositorySection, RepositoryFileSummary[]> {
  return {
    providers: [],
    engines: [],
    components: [],
    documentation: [],
    tests: [],
  };
}

export function generateRepositorySummary(repositoryRoot: string): RepositorySummary {
  const files = scanFiles(repositoryRoot);
  const sections = createEmptySections();

  files.forEach((file) => {
    Object.entries(sectionMatchers).forEach(([section, matcher]) => {
      if (matcher(file.path)) {
        sections[section as RepositorySection].push(file);
      }
    });
  });

  return {
    generatedAt: new Date().toISOString(),
    repositoryRoot,
    totals: {
      components: sections.components.length,
      documentation: sections.documentation.length,
      engines: sections.engines.length,
      files: files.length,
      providers: sections.providers.length,
      tests: sections.tests.length,
    },
    sections,
  };
}

export function generateRepositoryMarkdown(summary: RepositorySummary) {
  const lines = [
    "# Repository Summary",
    "",
    `Generated: ${summary.generatedAt}`,
    `Repository Root: ${summary.repositoryRoot}`,
    "",
    "## Totals",
    "",
    `- Files: ${summary.totals.files}`,
    `- Providers: ${summary.totals.providers}`,
    `- Engines: ${summary.totals.engines}`,
    `- Components: ${summary.totals.components}`,
    `- Documentation: ${summary.totals.documentation}`,
    `- Tests: ${summary.totals.tests}`,
    "",
  ];

  Object.entries(summary.sections).forEach(([section, files]) => {
    lines.push(`## ${section}`);
    lines.push("");
    files.forEach((file) => {
      lines.push(`- ${file.path}`);
    });
    lines.push("");
  });

  return lines.join("\n");
}

export function readProjectConfig(repositoryRoot: string) {
  const configPath = join(repositoryRoot, "atlas", "config", "project.json");

  if (!existsSync(configPath)) {
    return null;
  }

  return JSON.parse(readFileSync(configPath, "utf8")) as Record<string, unknown>;
}
