const { CONTEXT_NAME } = require('./constants');
function createStatus(github, event, status) {
  return function(msg) {
    const baseData = {
      repo: event.payload.repository.name,
      owner: event.payload.repository.owner.login,
      sha: event.payload.pull_request.head.sha,
    };
    github.repos.createStatus(
      Object.assign(baseData, {
        state: status,
        description: msg,
        context: CONTEXT_NAME,
      }),
    );
  };
}

module.exports = { createStatus };
