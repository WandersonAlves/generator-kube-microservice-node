'use strict';
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  _capitalize(str) {
    const str2 = str.toLowerCase();
    return str2.charAt(0).toUpperCase() + str2.slice(1)
  }

  start() {
    this.usage('Welcome to Kube Generator');
    this.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Enter the name for your project: (i.e.: something-service)'
      },
      {
        type: 'input',
        name: 'entityName',
        message: "Enter the name of your first entity: (i.e.: SomeEntity)"
      }
    ]).then((answers) => {
      console.log(
        "Remember to check Docker image on package.json and deployment.yaml (in case you use private repo)",
        "\nIf you will use the queue files, ensure that put a cert file somewhere if you run on production env",
        "\nAlso, remember to put a .env file on root repo with your secrets"
      );
      // create destination folder
      this.destinationRoot(answers.projectName);
      // copy template to destination folder
      this.fs.copyTpl(
        this.templatePath('./**'),
        this.destinationPath('./'),
        {
          projectName: answers.projectName,
          controllerName: `${this._capitalize(answers.entityName)}Controller`,
          serviceInstanceName: `${answers.entityName.replace(/^\w/, c => c.toLowerCase())}Service`,
          serviceName: `${this._capitalize(answers.entityName)}Service`,
          modelName: `${this._capitalize(answers.entityName)}Model`,
          interfaceName: `${this._capitalize(answers.entityName)}Interface`,
          entityName: this._capitalize(answers.entityName),
          entityNameLowerCase: answers.entityName.replace(/^\w/, c => c.toLowerCase())
        },
        null,
        {
          globOptions: {
            dot: true
          }
        }
      );
      this.fs.move(
        this.destinationPath('./gitignore'),
        this.destinationPath('./.gitignore')
      );
      this.fs.move(
        this.destinationPath('./aliases/**'),
        this.destinationPath('./aliases/**')
      );
      this.fs.move(
        this.destinationPath("./src/controllers/EntityController.ts"),
        this.destinationPath(
          `./src/controllers/${this._capitalize(answers.entityName)}Controller.ts`
        )
      );
      this.fs.move(
        this.destinationPath(`./src/services/EntityService.ts`),
        this.destinationPath(`./src/services/${this._capitalize(answers.entityName)}Service.ts`)
      );
      this.fs.move(
        this.destinationPath(`./src/models/EntityModel.ts`),
        this.destinationPath(`./src/models/${this._capitalize(answers.entityName)}Model.ts`)
      );
      this.fs.move(
        this.destinationPath(`./src/models/EntityInterface.ts`),
        this.destinationPath(`./src/models/${this._capitalize(answers.entityName)}Interface.ts`)
      );
      this.composeWith(require.resolve('generator-git-init/generators/app'))
      this.installDependencies({
        yarn: true,
        npm: false,
        bower: false
      })
    });
  }
};