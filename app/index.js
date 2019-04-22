'use strict';
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
      // create destination folder
      this.destinationRoot(answers.projectName);
      // copy template to destination folder
      this.fs.copyTpl(
        this.templatePath('./**'),
        this.destinationPath('./'),
        {
          projectName: answers.projectName,
          controllerName: `${answers.entityName}Controller`,
          controllerInstanceName: `${answers.entityName.replace(/^\w/, c => c.toLowerCase())}Controller`,
          businessName: `${answers.entityName}Business`,
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
      // rename entity folder
      this.fs.move(
        this.destinationPath('./src/entities/SomeEntity/**'),
        this.destinationPath(`./src/entities/${answers.entityName}`)
      )
      this.fs.move(
        this.destinationPath('./src/routes/entityRoute/**'),
        this.destinationPath(`./src/routes/${answers.entityName}`)
      )
      this.fs.move(
        this.destinationPath(`./src/entities/${answers.entityName}/EntityBusiness.ts`),
        this.destinationPath(`./src/entities/${answers.entityName}/${answers.entityName}Business.ts`)
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
      this.yarnInstall();
      console.log('Remember to check Docker image on package.json (in case you use private repo)');
      console.log('Also, remember to put a .env file on root repo with your secrets');
    });
  }

};