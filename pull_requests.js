const {
  SUCCESS,
  FAILURE,
  EMPTY_CHECK,
  FILLED_CHECK,
  THIS_IS_FINE,
} = require('./constants');
const { createStatus } = require('./utils');

module.exports = function handlePullRequestEvent(app) {
  return function(event) {
    const installation = event.payload.installation.id;
    app.asInstallation(installation).then(function(github) {
      const lines = event.payload.pull_request.body.split('/n');
      const anyEmpties = lines.some(line => EMPTY_CHECK.exec(line));
      const anyChecks = lines.some(line => FILLED_CHECK.exec(line));
      const itIsFine = lines.some(line => THIS_IS_FINE.exec(line));
      const succeed = createStatus(github, event, SUCCESS);
      const fail = createStatus(github, event, FAILURE);
      if (itIsFine) {
        succeed('If you say so...');
      } else if (anyEmpties) {
        fail('Checklists must be complete');
      } else if (!anyEmpties && !anyChecks) {
        succeed('Sneaky sneaky, you need a checklist...');
      } else {
        succeed('All requirements met.');
      }
    });
  };
};
