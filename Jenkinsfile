// CODE_CHANGES = getGitChanges()
pipeline {
  agent any
  environment {
    NEW_VERSION = '1.3.0'
    SEVER_CREDENTIALS = credentials('server-credentials')
  }
  parameters {
    string(name: 'VERSION', defaultValue: '', description: 'version to deploy on prod')
    choice(name: 'VERSION', choices: ['1.1.0', '1.2.0', '1.3.0'], description: '')
    booleanParam(name: 'executeTests', defaultValue: true, description: '')
  }
  stages {
    stage('build') {
      // when {
      //   // execute when branch dev
      //   expression {
      //     BRANCH_NAME == 'dev' && CODE_CHANGES == true
      //   }
      // }
      steps {
        echo "Building the application..."
        echo "Building version ${NEW_VERSION}"
        nodejs('Node') {
          sh 'npm install'
        }
      }
    }

    stage('test') {
      when {
        expression {
          params.executeTests == true
        }
      }
      // condition
      // when {
      //   // execute when branch dev
      //   expression {
      //     BRANCH_NAME == 'dev' || BRANCH_NAME == 'master' || BRANCH_NAME == 'main'
      //   }
      // }
      steps {
        echo 'Deploy application'
      }
    }

    stage('deploy') {
      steps {
        echo 'Deploy application'
        echo "deploy version ${params.VERSION}"
        // echo "server credentials: ${SEVER_CREDENTIALS}"
        // sh "${SEVER_CREDENTIALS}"
        // withCredentials([
        //   usernamePassword(credentials: 'server-credentials', usernameVariable: USER, passwordVariable: PWD)
        // ]) {
        //   sh "echo ${USER} ${PWD}"
        // }
      }
    }
  }

  // post {
  //   // always {
  //   //   // always execute 
  //   // }

  //   // success {
  //   //   // execute when success
  //   // }
  // }
}
