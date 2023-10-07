pipeline{
    agent any
    stages{
        stage("check"){
            steps{
                sh 'echo "check print"'
                sh 'node -v'
                sh 'npm -v'
            }
        }
        stage("run"){
            steps{
                sh 'npm i'
                sh 'npm run build'
                sh 'npm start'
            }
        }


    }
}