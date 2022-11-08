const core = require('@actions/core');
const { context, GitHub } = require('@actions/github');
const { execSync } = require("child_process");

const main = () => {
  const sha = context.sha;
  const token = core.getInput('github-token');
  const testCommand = core.getInput("test-command") || "npx jest";
  const codeCoverage = execSync(testCommand).toString();

  const output = {
    title: 'Code coverage',
    summary: 'Jest code coverage',
    annotations: [{
      path: 'src/',
      start_line: 1,
      end_line: 1,
      annotation_level: 'notice',
      message: codeCoverage
    }]
  }
  const github = new GitHub(token)
  return github.checks.create({
      ...context.repo,
      title: 'Code coverage',
      head_sha: sha,
      conclusion: 'success',
      output
    });
    
};

main().catch((e) => core.setFailed(e.message));
