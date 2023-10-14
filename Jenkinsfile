pipeline{
    agent any
    stages{
        stage("Clone"){
            steps{
              echo "Git clone here..."

              

                  withCredentials([string(credentialsId: 'PAT', variable: 'GIT_PAT')]){
                    echo '$GIT_PAT'

                    // git url: 'https://$GIT_PAT@github.com/Ranjit67/node-base-setup.git', branch: "main"

                    // sh "git clone https://<your-pat-token>@github.com/Ranjit67/node-base-setup.git"
          
            }
            }
        }
        stage("build"){
            steps{
                echo "Build image here..."
                sh 'docker build -t node-app .'
            }
        }
        stage("push in docker"){
            steps{
                echo "Build push into docker."
                
                withCredentials([usernamePassword(credentialsId: 'docker-user', usernameVariable: 'username', passwordVariable: 'password')]) {
                    sh 'docker tag node-app $username/node-app:latest'
  
            sh 'docker login -u $username -p $password'
            sh 'docker push --target $username/node-app:latest'
          
            }
                
            }
        }
        stage("Deploy"){
            steps{
                
                sh 'docker-compose -f docker-compose.prod.yml down'

                echo "Deploying code pipline here..."
                sh 'docker-compose -f docker-compose.prod.yml up -d'
            }
        }
        stage("test"){
            steps{
                echo "Test"
                sh 'curl http://localhost:8082'
            }
        }


    }
}