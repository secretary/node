const {Adapter} = require("@secretary/aws-secrets-manager-adapter");
const {SecretsManager} = require('@aws-sdk/client-secrets-manager');

module.exports = (manager) => ({
  sources: {
    aws: new Adapter(new SecretsManager({
      region: 'us-east-1',
    })),
  },
  secrets: [
    {
      name: 'BOT_TOKEN',
      secret: 'bot/development',
      property: 'token',
      source: 'aws'
    }
  ]
})
