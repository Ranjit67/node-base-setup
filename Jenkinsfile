pipeline{
    agent any
    stages{
        stage("Clone"){
            steps{
              echo "Git clone here..."
              git url: "https://github.com/Ranjit67/node-base-setup.git", branch: "main"
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
                withCredentials([usernamePassword(credentialsId:"docker-user",passwordVariable:"password",usernameVariable:"username")]){
                    sh 'docker login -u ${env.password} -p ${env.username}'
                }
                
            }
        }
        stage("Deploy"){
            steps{
                echo "Deploying code pipline here..."
            }
        }


    }
}