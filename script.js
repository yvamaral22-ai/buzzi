const root = document.documentElement;
const introScreen = document.getElementById("intro-screen");
const siteShell = document.getElementById("site-shell");
const enterButton = document.getElementById("enter-button");
const audioPlayer = document.getElementById("audio-player");
const playButton = document.getElementById("play-button");
const playLabel = document.getElementById("play-label");
const playSymbol = document.getElementById("play-symbol");
const restartButton = document.getElementById("restart-button");
const progressWrap = document.getElementById("progress-wrap");
const progressBar = document.getElementById("progress-bar");
const currentTime = document.getElementById("current-time");
const totalTime = document.getElementById("total-time");
const audioStatus = document.getElementById("audio-status");

const fallbackImages = {
  hero: "assets/placeholder-main.svg",
  square: "assets/placeholder-cover.svg",
  gallery: "assets/placeholder-gallery.svg",
  profile: "assets/placeholder-profile.svg"
};

document.addEventListener("DOMContentLoaded", () => {
  applyTheme(siteConfig.theme);
  applyMeta(siteConfig.meta);
  populateIntro(siteConfig.intro);
  populateHero();
  populateRelationship();
  populateAudio();
  populateHighlights();
  populateGallery();
  populateMessage();
  populateFooter();
  setupIntroReveal();
  setupObserver();
});

function applyTheme(theme) {
  const themeMap = {
    "--bg-start": theme.bgStart,
    "--bg-end": theme.bgEnd,
    "--accent": theme.accent,
    "--accent-strong": theme.accentStrong,
    "--accent-soft": theme.accentSoft,
    "--text-main": theme.textMain,
    "--text-muted": theme.textMuted,
    "--surface": theme.surface,
    "--surface-strong": theme.surfaceStrong
  };

  Object.entries(themeMap).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

function applyMeta(meta) {
  document.title = meta.title;
  const description = document.getElementById("meta-description");
  if (description) {
    description.setAttribute("content", meta.description);
  }
}

function populateIntro(intro) {
  setText("intro-kicker", intro.kicker);
  setText("intro-title", intro.title);
  setText("intro-subtitle", intro.subtitle);
  setText("enter-button", intro.buttonText);
  setText("intro-note", intro.note);
}

function populateHero() {
  setText("hero-badge", siteConfig.hero.badge);
  setText("hero-title", siteConfig.hero.title);
  setText("hero-text", siteConfig.hero.text);
  setText("start-label", siteConfig.hero.startLabel);
  setText("start-display", siteConfig.relationship.displayDateLabel);
  setText("signature-label", siteConfig.hero.signatureLabel);
  setText("signature-value", siteConfig.hero.signatureValue);

  setImage("hero-photo", siteConfig.media.heroPhoto, fallbackImages.hero);
  setImage("secondary-photo", siteConfig.media.secondaryPhoto, fallbackImages.gallery);
}

function populateRelationship() {
  setText("counter-kicker", siteConfig.relationship.kicker);
  setText("counter-title", siteConfig.relationship.title);
  setText("counter-subtitle", siteConfig.relationship.subtitle);
  setText("relationship-names", siteConfig.relationship.names);
  setText("relationship-caption", siteConfig.relationship.caption);
  setImage("profile-photo", siteConfig.media.profilePhoto, fallbackImages.profile);

  const labelMap = siteConfig.relationship.labels;
  setText("label-years", labelMap.years);
  setText("label-months", labelMap.months);
  setText("label-days", labelMap.days);
  setText("label-hours", labelMap.hours);
  setText("label-minutes", labelMap.minutes);
  setText("label-seconds", labelMap.seconds);

  updateCounter();
  window.setInterval(updateCounter, 1000);
}

function populateAudio() {
  setText("player-title", siteConfig.audio.playerTitle);
  setText("track-name", siteConfig.audio.title);
  setText("track-artist", siteConfig.audio.artist);
  setText("track-caption", siteConfig.audio.caption);
  setImage("track-cover", siteConfig.audio.coverImage, fallbackImages.square);

  if (!siteConfig.audio.file) {
    audioStatus.textContent = "Adicione o caminho do MP3 em config.js para ativar o player.";
    playButton.disabled = true;
    restartButton.disabled = true;
    return;
  }

  audioPlayer.src = siteConfig.audio.file;
  audioStatus.textContent = "Clique para ouvir a trilha escolhida para esse presente.";

  playButton.addEventListener("click", toggleAudio);
  restartButton.addEventListener("click", restartAudio);
  progressWrap.addEventListener("click", seekAudio);

  audioPlayer.addEventListener("loadedmetadata", () => {
    totalTime.textContent = formatTime(audioPlayer.duration);
  });

  audioPlayer.addEventListener("timeupdate", () => {
    if (!audioPlayer.duration) {
      return;
    }

    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = `${progress}%`;
    currentTime.textContent = formatTime(audioPlayer.currentTime);
  });

  audioPlayer.addEventListener("play", () => updatePlayerState(true));
  audioPlayer.addEventListener("pause", () => updatePlayerState(false));
  audioPlayer.addEventListener("ended", () => {
    updatePlayerState(false);
    audioPlayer.currentTime = 0;
    progressBar.style.width = "0%";
    currentTime.textContent = "0:00";
  });

  audioPlayer.addEventListener("error", () => {
    audioStatus.textContent = "Nao foi possivel carregar o audio. Confira se o arquivo existe na pasta assets.";
    playButton.disabled = true;
    restartButton.disabled = true;
  });
}

function populateHighlights() {
  setText("highlights-title", siteConfig.highlights.title);
  setText("highlights-subtitle", siteConfig.highlights.subtitle);

  const highlightGrid = document.getElementById("highlight-grid");
  highlightGrid.innerHTML = "";

  siteConfig.highlights.items.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "highlight-card";
    card.innerHTML = `
      <span class="highlight-index">Bloco ${String(index + 1).padStart(2, "0")}</span>
      <h4>${item.title}</h4>
      <p>${item.text}</p>
    `;
    highlightGrid.appendChild(card);
  });
}

function populateGallery() {
  setText("gallery-title", siteConfig.gallery.title);
  setText("gallery-subtitle", siteConfig.gallery.subtitle);

  const galleryGrid = document.getElementById("gallery-grid");
  galleryGrid.innerHTML = "";

  siteConfig.media.galleryImages.forEach((imagePath, index) => {
    const card = document.createElement("figure");
    card.className = "gallery-card";

    const image = document.createElement("img");
    image.alt = `Foto da galeria ${index + 1}`;
    image.src = imagePath;
    image.onerror = () => {
      image.onerror = null;
      image.src = fallbackImages.gallery;
    };

    card.appendChild(image);
    galleryGrid.appendChild(card);
  });
}

function populateMessage() {
  setText("message-kicker", siteConfig.message.kicker);
  setText("message-title", siteConfig.message.title);
  setText("message-body", siteConfig.message.body);
  setText("message-footer", siteConfig.message.footer);
}

function populateFooter() {
  setText("footer-note", siteConfig.footerNote);
}

function setupIntroReveal() {
  enterButton.addEventListener("click", () => {
    introScreen.classList.add("is-exiting");
    siteShell.classList.remove("is-hidden");
    siteShell.setAttribute("aria-hidden", "false");

    window.setTimeout(() => {
      introScreen.style.display = "none";
    }, 700);
  });
}

function setupObserver() {
  const items = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  items.forEach((item) => observer.observe(item));
}

function updateCounter() {
  const startDate = new Date(siteConfig.relationship.startDate);
  const now = new Date();

  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();
  let days = now.getDate() - startDate.getDate();
  let hours = now.getHours() - startDate.getHours();
  let minutes = now.getMinutes() - startDate.getMinutes();
  let seconds = now.getSeconds() - startDate.getSeconds();

  if (seconds < 0) {
    minutes -= 1;
    seconds += 60;
  }

  if (minutes < 0) {
    hours -= 1;
    minutes += 60;
  }

  if (hours < 0) {
    days -= 1;
    hours += 24;
  }

  if (days < 0) {
    months -= 1;
    const previousMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += previousMonthDays;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  setText("years", years);
  setText("months", months);
  setText("days", days);
  setText("hours", hours);
  setText("minutes", minutes);
  setText("seconds", seconds);
}

function toggleAudio() {
  if (audioPlayer.paused) {
    audioPlayer.play();
  } else {
    audioPlayer.pause();
  }
}

function restartAudio() {
  audioPlayer.currentTime = 0;
  if (audioPlayer.paused) {
    audioPlayer.play();
  }
}

function seekAudio(event) {
  if (!audioPlayer.duration) {
    return;
  }

  const bounds = progressWrap.getBoundingClientRect();
  const position = (event.clientX - bounds.left) / bounds.width;
  const limited = Math.max(0, Math.min(1, position));
  audioPlayer.currentTime = audioPlayer.duration * limited;
}

function updatePlayerState(isPlaying) {
  playLabel.textContent = isPlaying ? "Pausar" : "Ouvir";
  playSymbol.textContent = isPlaying ? "||" : ">";
  audioStatus.textContent = isPlaying
    ? "A trilha esta tocando."
    : "A trilha esta pronta para tocar.";
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}

function setImage(id, src, fallback) {
  const image = document.getElementById(id);
  if (!image) {
    return;
  }

  image.src = src;
  image.onerror = () => {
    image.onerror = null;
    image.src = fallback;
  };
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const safeSeconds = Math.floor(seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}
