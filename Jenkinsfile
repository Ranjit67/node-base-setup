pipeline{
    agent any
    stages{
        stage("check"){
            steps{
                sh 'echo "check print"'
                sh 'node -v'
                sh 'npm -v'
                sh 'pm2 -version'
            }
        }
        stage("run"){
            steps{
                sh 'ls'
                sh 'pwd'
                sh 'sudo chmod -R 777 .'
                sh 'npm i'
                sh 'npm run build'
                sh 'pm2 start build/server.js'
            }
        }


    }
}