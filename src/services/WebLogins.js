import NavigationService from '../services/NavigationService';

export default {
  openTwitterWebLogin:  () => {
    NavigationService.navigate('TwitterWebLogin', {
        title: 'Twitter'
    });
  },
  openGitHubWebLogin:  () => {
    NavigationService.navigate('GitHubWebLogin', {
        title: 'GitHub'
    });
  }
};
