const core = require("@actions/core");
const { execSync } = require("child_process");
const { context, getOctokit } = require("@actions/github");

const main = () => {
  const githubToken = core.getInput("github-token");
  const testCommand = core.getInput("test-command") || "npx jest";
  const sha = context.sha;
  const octokit = getOctokit(githubToken);

  const codeCoverage = execSync(testCommand).toString();
  let coveragePercentage = execSync(
    "npx coverage-percentage ./coverage/lcov.info --lcov"
  ).toString();
  coveragePercentage = parseFloat(coveragePercentage).toFixed(2);

  const body = `<p>Total Coverage: <code>${ coveragePercentage }</code></p>
                <details>
                  <summary>Coverage report</summary>
                  <p>
                    <pre>${ codeCoverage }</pre>
                  </p>
                </details>`;

  return octokit
    .rest
    .checks
    .create({
      ...context.repo,
      head_sha: sha,
      name: stripAnsi(actionName),
      conclusion: success ? 'success' : 'failure',
      external_id: v4(),
      output
  })
  .catch(e => {
    if (e.message === 'Resource not accessible by integration')
      warning('This library requires the write permission of checks to operate.\n  Skip write check step.');
    else
      throw e;
  })
};

main().catch((e) => core.setFailed(e));
