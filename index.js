const core = require('@actions/core');
const { execSync } = require("child_process");

const main = () => {
  const testCommand = core.getInput("test-command") || "npx jest";

  const codeCoverage = execSync(testCommand).toString();

  let coveragePercentage = execSync(
    "npx coverage-percentage ./coverage/lcov.info --lcov"
  ).toString();

  coveragePercentage = parseFloat(coveragePercentage).toFixed(2);

  core.info(`<p>Total Coverage: <code>${ coveragePercentage }</code></p>
              <details>
                <summary>Coverage report</summary>
                <p>
                  <pre>${ codeCoverage }</pre>
                </p>
              </details>`);
};

main().catch((e) => core.setFailed(e));
