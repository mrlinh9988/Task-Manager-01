def buildApp() {
  echo "Building the application..."
  echo "Building version ${NEW_VERSION}"
  echo "Building version ${SEVER_CREDENTIALS}"
}

def testApp() {
  echo 'Test the application...'
}

def deployApp() {
  echo 'Deploy application'
  echo "deploy version ${params.VERSION}"
}

return this