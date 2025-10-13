
    const LIFF_ID = '2006943877-6JqPzkM5';
    const API_URL = 'https://script.google.com/macros/s/AKfycbyUI2kIpjS3yIAiPeR8JiVufxIgTXfI_sr_uyj5SgUopIjQGypJXuzkErPAHd_l3j1C/exec';
    
    let userProfile = null;

    
    // Initialize LIFF
    window.onload = function() {
      liff.init({ liffId: LIFF_ID })
        .then(() => {
          if (!liff.isLoggedIn()) {
            liff.login();
            return;
          }
          
          return liff.getProfile();
        })
        .then((profile) => {
          if (profile) {
            userProfile = profile;
            document.getElementById('userGreeting').textContent = 
              'Hi, ' + profile.displayName + '! 👋';
            loadProducts();
          }
        })
        .catch((err) => {
          console.error('LIFF Error:', err);
          document.getElementById('loading').innerHTML = 
            '<p style="color: #c62828;">Failed to initialize. Please try again.</p>';
        });
    };
    
    

