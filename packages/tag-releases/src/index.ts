import readChangesets from "@changesets/read";
import execa from "execa";

const runCommand = async (command: string, args: readonly string[] = []): Promise<void> => {
    const { stdout, stderr } = await execa(command, args);

    console.log(stdout.trim() || stderr.trim());
};

export const tagReleases = async () => {
    const changesets = await readChangesets(process.cwd());
    const hasChangesets = !!changesets.length;

    if (!hasChangesets) return;

    await runCommand("git fetch origin", ["refs/tags/*:refs/tags/*"]);
    await runCommand("git config user.email", ["leedavidcs@gmail.com"]);
    await runCommand("git config user.name", ["David Lee"]);
    await runCommand("pnpm chnageset version");
    await runCommand("git add .");
    await runCommand("git commit", ["-m", "versioned packages"]);
    await runCommand("pnpm changeset tag");
    await runCommand("git push origin", ["--tags"]);

    process.exit(0);
};
