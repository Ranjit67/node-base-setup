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
                
            }
        }


    }
}