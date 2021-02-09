// CODE_CHANGES = getGitChanges()
pipeline {
  agent any
  tools {

  }
  environment {
    NEW_VERSION = '1.3.0'
    SEVER_CREDENTIALS = credentials('server-credentials')
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
        // echo "server credentials: ${SEVER_CREDENTIALS}"
        // sh "${SEVER_CREDENTIALS}"
        withCredentials([
          usernamePassword(credentials: 'server-credentials', usernameVariable: USER, passwordVariable: PWD)
        ]) {
          sh "echo ${USER} ${PWD}"
        }
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
