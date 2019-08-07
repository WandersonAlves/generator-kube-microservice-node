'use strict';
require('generator-git-init');
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }
  start() {
    this.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Enter the name for your project: (i.e.: company-something-service)'
      },
      {
        type: 'input',
        name: 'entityName',
        message: "Enter the name of your first entity: (i.e.: SomeEntity)"
      }
    ]).then((answers) => {
      console.log(
        "Remember to check Docker image on package.json (in case you use private repo)"
      );
      console.log(
        "Remember to run `yarn format` to let prettier format your code"
      );
      console.log(
        "Also, remember to put a .env file on root repo with your secrets"
      );
      // create destination folder
      this.destinationRoot(answers.projectName);
      // copy template to destination folder
      this.fs.copyTpl(
        this.templatePath('./**'),
        this.destinationPath('./'),
        {
          projectName: answers.projectName,
          controllerName: `${answers.entityName}Controller`,
          serviceInstanceName: `${answers.entityName.replace(/^\w/, c => c.toLowerCase())}Service`,
          serviceName: `${answers.entityName}Service`,
          modelName: `${answers.entityName}Model`,
          interfaceName: `${answers.entityName}Interface`,
          entityName: answers.entityName,
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
      )
      this.fs.move(
        this.destinationPath('./src/entities/SomeEntity/**'),
        this.destinationPath(`./src/entities/${answers.entityName}`)
      )
      this.fs.move(
        this.destinationPath(`./src/entities/${answers.entityName}/EntityService.ts`),
        this.destinationPath(`./src/entities/${answers.entityName}/${answers.entityName}Service.ts`)
      )
      this.fs.move(
        this.destinationPath(`./src/swaggerModels/EntitySwaggerModel.ts`),
        this.destinationPath(`./src/swaggerModels/${answers.entityName}SwaggerModel.ts`)
      )
      this.fs.move(
        this.destinationPath(`./src/entities/${answers.entityName}/EntityController.ts`),
        this.destinationPath(`./src/entities/${answers.entityName}/${answers.entityName}Controller.ts`)
      )
      this.fs.move(
        this.destinationPath(`./src/entities/${answers.entityName}/EntityModel.ts`),
        this.destinationPath(`./src/entities/${answers.entityName}/${answers.entityName}Model.ts`)
      )
      this.fs.move(
        this.destinationPath(`./src/entities/${answers.entityName}/EntityInterface.ts`),
        this.destinationPath(`./src/entities/${answers.entityName}/${answers.entityName}Interface.ts`)
      )
      this.composeWith('git-init', {}, {
        local: require.resolve('generator-git-init')
      })
      this.installDependencies({
        yarn: true,
        npm: false,
        bower: false
      })
    });
  }

};