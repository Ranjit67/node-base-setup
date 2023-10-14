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
                
                withCredentials([usernamePassword(credentialsId: 'docker-user', usernameVariable: 'username', passwordVariable: 'password')]) {
  
            sh 'echo $password'
  // also available as a Groovy variable
        echo username
  // or inside double quotes for string interpolation
            echo "username is $username"
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