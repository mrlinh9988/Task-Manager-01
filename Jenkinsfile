pipeline {
  agent any
  stages {
    stage('build') {
      steps {
        echo 'Building the application...'
        nodejs('Node') {
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
