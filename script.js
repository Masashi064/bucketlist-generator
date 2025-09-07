const API_URL = "/api/proxy";

// Loading overlay management
function showLoading() {
  const overlay = document.getElementById("loadingOverlay");
  overlay.classList.add("active");
}

function hideLoading() {
  const overlay = document.getElementById("loadingOverlay");
  overlay.classList.remove("active");
}

// Smooth scroll to generate section
function scrollToGenerate() {
  const generateSection = document.getElementById("generate-section");
  generateSection.scrollIntoView({ 
    behavior: 'smooth',
    block: 'center'
  });
  
  // Focus on input after scroll
  setTimeout(() => {
    const keywordInput = document.getElementById("keyword");
    keywordInput.focus();
  }, 800);
}

// Enhanced show ideas function with animations
async function showIdeas() {
  showLoading();
  
  try {
    const res = await fetch(`${API_URL}?action=random`);
    const data = await res.json();

    const ideaList = document.getElementById("ideaList");
    ideaList.innerHTML = "";

    // Add staggered animation delay
    data.slice(0, 10).forEach((r, index) => {
      const el = document.createElement("div");
      el.className = "idea";
      el.style.animationDelay = `${index * 0.1}s`;
      
      el.innerHTML = `
        <div class="idea-text">${r[2]}</div>
        <div class="idea-actions">
          <button class="like-btn" onclick="likeIdea('${r[0]}')">
            👍 いいね！
          </button>
        </div>
      `;
      
      ideaList.appendChild(el);
    });

    // Smooth scroll to ideas
    setTimeout(() => {
      document.getElementById("ideas-section").scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 300);
    
  } catch (error) {
    showError("アイディアの取得に失敗しました。しばらくしてからもう一度お試しください。");
  } finally {
    hideLoading();
  }
}

// Enhanced generate function with animations
async function generate() {
  const keyword = document.getElementById("keyword").value.trim();
  
  if (!keyword) {
    showError("キーワードを入力してください。");
    return;
  }

  showLoading();
  
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ action: "generate", keyword })
    });
    const data = await res.json();
    
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";
    
    // Add staggered animation delay
    data.forEach((r, index) => {
      const el = document.createElement("div");
      el.className = "idea";
      el.style.animationDelay = `${index * 0.1}s`;
      
      el.innerHTML = `
        <div class="idea-text">${r[2]}</div>
        <div class="idea-actions">
          <button class="like-btn" onclick="likeIdea('${r[0]}')">
            👍 いいね！
          </button>
        </div>
      `;
      
      resultsDiv.appendChild(el);
    });

    // Smooth scroll to results
    setTimeout(() => {
      resultsDiv.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 300);
    
  } catch (error) {
    showError("アイディアの生成に失敗しました。しばらくしてからもう一度お試しください。");
  } finally {
    hideLoading();
  }
}

// Enhanced like function with visual feedback
async function likeIdea(id) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },  // ←追加
      body: JSON.stringify({ action: "like", id })
    });

    // レスポンス確認（開発中はコンソールに出すと安心）
    const result = await res.json();
    console.log("like result:", result);

    // ボタンのビジュアルフィードバック
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = "👍 ありがとう！";
    button.style.background = "var(--accent-color)";
    button.style.color = "var(--text-light)";
    button.disabled = true;

    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = "";
      button.style.color = "";
      button.disabled = false;
    }, 2000);

  } catch (error) {
    showError("いいねの送信に失敗しました。");
    console.error(error);
  }
}

// Error notification function
function showError(message) {
  // Create error notification
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-notification';
  errorDiv.textContent = message;
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #e74c3c;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
    z-index: 10000;
    animation: slideInRight 0.3s ease-out;
  `;
  
  document.body.appendChild(errorDiv);
  
  setTimeout(() => {
    errorDiv.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => {
      document.body.removeChild(errorDiv);
    }, 300);
  }, 3000);
}

// Add CSS for error notifications
const errorStyles = document.createElement('style');
errorStyles.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(errorStyles);

// Add keyboard support
document.getElementById("keyword").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    generate();
  }
});

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
    }
  });
}, observerOptions);

// Observe elements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.section-header, .generate-section');
  animatedElements.forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const heroBackground = document.querySelector('.hero-background img');
  if (heroBackground) {
    heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});

// Add smooth reveal animations for cards
function revealCards() {
  const cards = document.querySelectorAll('.idea');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 100);
  });
}