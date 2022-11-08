const core = require('@actions/core');
const { context, GitHub } = require('@actions/github');
const { execSync } = require("child_process");

const main = () => {
  const token = core.getInput('github-token');
  const testCommand = core.getInput("test-command") || "npx jest";
  const codeCoverage = execSync(testCommand).toString();

  
  let coveragePercentage = execSync(
    "npx coverage-percentage ./coverage/lcov.info --lcov"
  ).toString();

  coveragePercentage = parseFloat(coveragePercentage).toFixed(2);
  
  const output = {
    title: 'Code coverage',
    summary: 'Jest code coverage',
    annotations: [{
      path: '',
      start_line: 1,
      end_line: 1,
      annotation_level: 'notice',
      message: `<p>Total Coverage: <code>${ coveragePercentage }</code></p>
                  <details>
                    <summary>Coverage report</summary>
                    <p>
                      <pre>${ codeCoverage }</pre>
                    </p>
                  </details>`
    }]
  }
  const github = new GitHub(token)
  github.checks.create({
      ...context.repo,
      name: 'Coverage Report',
      head_sha: sha,
      conclusion: 'success',
      output
    });
    
};

main();
