import readChangesets from "@changesets/read";
import execa from "execa";

const runGitCommand = async (command: string, args: readonly string[] = []): Promise<void> => {
    const { stdout, stderr } = await execa(command, args);

    console.log(command);
    console.log(stdout, stderr);
};

const runShellCommand = async (command: string): Promise<void> => {
    const { stdout, stderr } = await execa.command(command);

    console.log(command);
    console.log(stdout, stderr);
};

export const tagReleases = async () => {
    const changesets = await readChangesets(process.cwd());
    const hasChangesets = !!changesets.length;

    if (!hasChangesets) return;

    await runGitCommand("git", ["fetch", "origin", "refs/tags/*:refs/tags/*"]);
    await runGitCommand("git", ["config", "user.email", "\"github-actions[bot]@users.noreply.github.com\""]);
    await runGitCommand("git", ["config", "user.name", "\"github-actions[bot]\""]);
    await runShellCommand("pnpm changeset version");
    await runGitCommand("git", ["add", "."]);
    await runGitCommand("git", ["commit", "-m", "versioned packages"]);
    await runShellCommand("pnpm changeset tag");
    await runGitCommand("git", ["push", "origin", "master", "--tags"]);

    process.exit(0);
};
