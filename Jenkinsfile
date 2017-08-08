#!groovy
@Library('c2c-pipeline-library')
import static com.camptocamp.utils.*

dockerBuild {
    stage('Build') {
        checkout scm
        sh 'make -j2 build'
    }
    stage('Test') {
        checkout scm
        sh 'docker-compose up'
        sh 'curl https://localhost:8480/wsgi/check_collector?'
        sh 'curl https://localhost:8480/wsgi/check_collector?type=all'
    }
}
