pipeline {
  agent any
  stages {
    stage('build') {
      steps {
        echo 'Building the application...'
        nodejs('Node-15') {
          sh 'npm install'
        }
      }
    }

    stage('deploy') {
      steps {
        echo 'Deploy application'
      }
    }
  }
}
