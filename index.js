class InfiniteScroll {
  constructor(container, loader) {
    this.container = container;
    this.loader = loader;
    this.loading = false;
    this.loadedIds = new Set();
    this.onScroll = this.handleScroll.bind(this);
    this.init();
  }

  init() {
    window.addEventListener("load", () => this.getData());
    window.addEventListener("scroll", this.onScroll);
  }

  setLoading(flag) {
    this.loader.classList.toggle("hidden", !flag);
  }

  async getData() {
    if (this.loading) return;
    this.loading = true;
    this.setLoading(true);

    try {
      const randomIds = [];
      while (randomIds.length < 4) {
        const id = Math.floor(Math.random() * 100) + 1;
        if (!this.loadedIds.has(id)) {
          this.loadedIds.add(id);
          randomIds.push(id);
        }
        if (this.loadedIds.size >= 100) this.loadedIds.clear();
      }

      const responses = await Promise.all(
        randomIds.map((id) =>
          fetch(`https://jsonplaceholder.typicode.com/posts/${id}`).then((res) =>
            res.json()
          )
        )
      );

      // Symulacja 1 sekundy ładowania
      await new Promise((resolve) => setTimeout(resolve, 300));

      this.displayPosts(responses);
    } catch (err) {
      console.error("Błąd pobierania danych:", err);
    }

    this.setLoading(false);
    this.loading = false;
  }

  handleScroll() {
    if (window.scrollY + window.innerHeight >= document.body.offsetHeight - 50) {
      this.getData();
    }
  }

  displayPosts(posts) {
    this.container.innerHTML += posts
      .map(
        (post) => `
        <div class="post">
          <h3>${this.capitalizeFirstLetter(post.title)}</h3>
          <p>${this.capitalizeFirstLetter(post.body)}</p>
        </div>
      `
      )
      .join("");
  }

  capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

const iScroll = new InfiniteScroll(
  document.querySelector(".container"),
  document.querySelector(".loader-box")
);







class DarkMode {
    constructor() {
        this.button = document.querySelector("#checkbox");
        this.init();
        this.theme = localStorage.getItem("theme");
    }

    init() {
        if (this.theme){
            document.documentElement.setAttribute("data-theme", this.theme);

            if (this.theme === "dark") this.button.checked = true;
        }
        this.button.addEventListener("change", this.switchTheme);
    }
    switchTheme = (e) => {
        let theme = e.target.checked ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }
}

const darkMode = new DarkMode();