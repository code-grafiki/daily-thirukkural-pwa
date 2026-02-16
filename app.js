// Thirukkural PWA App
class ThirukkuralApp {
  constructor() {
    this.kuralData = null;
    this.detailData = null;
    this.currentKuralNumber = null;
    this.bookmarks = JSON.parse(localStorage.getItem('thirukkural-bookmarks') || '[]');
    this.currentTab = 'mv';
    
    this.init();
  }
  
  async init() {
    this.registerServiceWorker();
    this.setupEventListeners();
    this.updateDateDisplay();
    
    try {
      await this.loadData();
      this.showTodaysKural();
    } catch (error) {
      console.error('Failed to load data:', error);
      this.showError();
    }
    
    this.checkInstallable();
  }
  
  // Register Service Worker
  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration);
        })
        .catch((error) => {
          console.log('SW registration failed:', error);
        });
    }
  }
  
  // Load data from GitHub
  async loadData() {
    const [kuralResponse, detailResponse] = await Promise.all([
      fetch('https://raw.githubusercontent.com/tk120404/thirukkural/master/thirukkural.json'),
      fetch('https://raw.githubusercontent.com/tk120404/thirukkural/master/detail.json')
    ]);
    
    const kuralJson = await kuralResponse.json();
    const detailJson = await detailResponse.json();
    
    this.kuralData = kuralJson.kural;
    this.detailData = detailJson[0];
  }
  
  // Get today's kural number (1-1330) - random shuffle without repeats
  getTodaysKuralNumber() {
    const TOTAL_KURALS = 1330;
    const STORAGE_KEY = 'thirukkural-daily-sequence';

    let sequence = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    let today = new Date().toDateString();
    let lastDate = localStorage.getItem('thirukkural-last-date');

    // Initialize shuffled sequence if first run or all kurals shown
    if (!sequence || sequence.index >= TOTAL_KURALS) {
      sequence = {
        order: this._shuffleArray([...Array(TOTAL_KURALS)].map((_, i) => i + 1)),
        index: 0
      };
    }

    // Advance index if it's a new day
    if (today !== lastDate) {
      sequence.index++;
      localStorage.setItem('thirukkural-last-date', today);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sequence));
    return sequence.order[sequence.index % TOTAL_KURALS];
  }

  _shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  // Get chapter info for a kural number
  getChapterInfo(kuralNumber) {
    const sections = this.detailData.section.detail;
    
    for (const section of sections) {
      const chapterGroups = section.chapterGroup.detail;
      for (const group of chapterGroups) {
        const chapters = group.chapters.detail;
        for (const chapter of chapters) {
          if (kuralNumber >= chapter.start && kuralNumber <= chapter.end) {
            return {
              section: section.name,
              group: group.name,
              chapter: chapter.name,
              chapterTrans: chapter.translation
            };
          }
        }
      }
    }
    return null;
  }
  
  // Show a specific kural
  showKural(number) {
    if (!this.kuralData || number < 1 || number > 1330) return;
    
    this.currentKuralNumber = number;
    const kural = this.kuralData[number - 1];
    const chapterInfo = this.getChapterInfo(number);
    
    // Hide loading, show content
    document.getElementById('loading').style.display = 'none';
    document.getElementById('kural-content').style.display = 'block';
    document.getElementById('error-message').style.display = 'none';
    
    // Update content
    document.getElementById('kural-number').textContent = `Kural #${kural.Number}`;
    document.getElementById('kural-chapter').textContent = chapterInfo 
      ? `${chapterInfo.chapter} | ${chapterInfo.chapterTrans}`
      : '';
    document.getElementById('line1').textContent = kural.Line1;
    document.getElementById('line2').textContent = kural.Line2;
    document.getElementById('trans1').textContent = kural.transliteration1;
    document.getElementById('trans2').textContent = kural.transliteration2;
    document.getElementById('translation').textContent = kural.Translation;
    
    // Update meaning
    this.updateMeaning(kural);
    
    // Update navigation buttons
    this.updateNavigationButtons();
    
    // Update bookmark button
    this.updateBookmarkButton();
  }
  
  // Update meaning content
  updateMeaning(kural) {
    const meanings = {
      mv: kural.mv || 'No meaning available',
      sp: kural.sp || 'No meaning available',
      mk: kural.mk || 'No meaning available',
      en: kural.explanation || 'No explanation available'
    };
    
    document.getElementById('meaning-content').textContent = meanings[this.currentTab];
  }
  
  // Show today's kural
  showTodaysKural() {
    const todayNumber = this.getTodaysKuralNumber();
    this.showKural(todayNumber);
  }

  // Show random kural (Feeling Lucky)
  showRandomKural() {
    const randomNumber = Math.floor(Math.random() * 1330) + 1;
    this.showKural(randomNumber);
    this.showToast('🎲 Random Kural!');
  }

  // Navigation
  goToPrevious() {
    if (this.currentKuralNumber > 1) {
      this.showKural(this.currentKuralNumber - 1);
    }
  }
  
  goToNext() {
    if (this.currentKuralNumber < 1330) {
      this.showKural(this.currentKuralNumber + 1);
    }
  }
  
  updateNavigationButtons() {
    document.getElementById('prev-btn').disabled = this.currentKuralNumber <= 1;
    document.getElementById('next-btn').disabled = this.currentKuralNumber >= 1330;
  }
  
  // Tab switching
  switchTab(tab) {
    this.currentTab = tab;
    
    // Update button states
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    
    // Update content
    if (this.currentKuralNumber) {
      const kural = this.kuralData[this.currentKuralNumber - 1];
      this.updateMeaning(kural);
    }
  }
  
  // Bookmark functionality
  toggleBookmark() {
    const index = this.bookmarks.indexOf(this.currentKuralNumber);
    
    if (index === -1) {
      this.bookmarks.push(this.currentKuralNumber);
      this.showToast('Kural bookmarked! 🔖');
    } else {
      this.bookmarks.splice(index, 1);
      this.showToast('Bookmark removed');
    }
    
    localStorage.setItem('thirukkural-bookmarks', JSON.stringify(this.bookmarks));
    this.updateBookmarkButton();
    this.renderBookmarks();
  }
  
  updateBookmarkButton() {
    const isBookmarked = this.bookmarks.includes(this.currentKuralNumber);
    const btn = document.getElementById('bookmark-btn');
    btn.innerHTML = isBookmarked ? '<span>❤️</span> Saved' : '<span>🔖</span> Save';
    btn.style.background = isBookmarked ? 'rgba(231, 76, 60, 0.3)' : '';
  }
  
  renderBookmarks() {
    const container = document.getElementById('bookmarks-list');
    const section = document.getElementById('bookmarks-section');
    
    if (this.bookmarks.length === 0) {
      section.style.display = 'none';
      return;
    }
    
    section.style.display = 'block';
    container.innerHTML = this.bookmarks.map(num => {
      const kural = this.kuralData[num - 1];
      return `
        <div class="bookmark-item" data-number="${num}">
          <div class="kural-preview">
            <strong>#${num}</strong> ${kural.Line1.substring(0, 30)}...
          </div>
          <button class="delete-btn" data-number="${num}">🗑️</button>
        </div>
      `;
    }).join('');
    
    // Add click handlers
    container.querySelectorAll('.bookmark-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (!e.target.classList.contains('delete-btn')) {
          const num = parseInt(item.dataset.number);
          this.showKural(num);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
    
    container.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const num = parseInt(btn.dataset.number);
        const index = this.bookmarks.indexOf(num);
        if (index > -1) {
          this.bookmarks.splice(index, 1);
          localStorage.setItem('thirukkural-bookmarks', JSON.stringify(this.bookmarks));
          this.renderBookmarks();
          this.updateBookmarkButton();
        }
      });
    });
  }
  
  // Share functionality
  async shareKural() {
    const kural = this.kuralData[this.currentKuralNumber - 1];
    const shareText = `📖 Thirukkural #${kural.Number}\n\n${kural.Line1}\n${kural.Line2}\n\n${kural.Translation}\n\nvia Daily Thirukkural App`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Thirukkural #${kural.Number}`,
          text: shareText
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      this.copyToClipboard(shareText);
    }
  }
  
  // Copy to clipboard
  copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.showToast('Copied to clipboard! 📋');
      });
    } else {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.showToast('Copied to clipboard! 📋');
    }
  }
  
  // Copy current kural
  copyKural() {
    const kural = this.kuralData[this.currentKuralNumber - 1];
    const text = `📖 Thirukkural #${kural.Number}\n\n${kural.Line1}\n${kural.Line2}\n\n${kural.Translation}`;
    this.copyToClipboard(text);
  }
  
  // Toast notification
  showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
  
  // Update date display
  updateDateDisplay() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = new Date().toLocaleDateString('en-US', options);
    document.getElementById('current-date').textContent = dateStr;
  }
  
  // Show error
  showError() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('kural-content').style.display = 'none';
    document.getElementById('error-message').style.display = 'block';
  }
  
  // Check if app is installable
  checkInstallable() {
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      document.getElementById('install-btn').style.display = 'inline-block';
      
      document.getElementById('install-btn').addEventListener('click', async () => {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          this.showToast('App installed! 📲');
          document.getElementById('install-btn').style.display = 'none';
        }
        
        deferredPrompt = null;
      });
    });
    
    window.addEventListener('appinstalled', () => {
      this.showToast('Thanks for installing! 🎉');
      document.getElementById('install-btn').style.display = 'none';
      deferredPrompt = null;
    });
  }
  
  // Setup event listeners
  setupEventListeners() {
    // Navigation
    document.getElementById('prev-btn').addEventListener('click', () => this.goToPrevious());
    document.getElementById('next-btn').addEventListener('click', () => this.goToNext());
    document.getElementById('today-btn').addEventListener('click', () => this.showTodaysKural());
    
    // Actions
    document.getElementById('lucky-btn').addEventListener('click', () => this.showRandomKural());
    document.getElementById('share-btn').addEventListener('click', () => this.shareKural());
    document.getElementById('copy-btn').addEventListener('click', () => this.copyKural());
    document.getElementById('bookmark-btn').addEventListener('click', () => this.toggleBookmark());
    
    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
    });
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ThirukkuralApp();
});
