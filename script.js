(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const lerp = (a, b, n) => a + (b - a) * n;

  const loader = document.getElementById("loader");
  const loaderBar = document.getElementById("loader-bar");
  const loaderPct = document.getElementById("loader-pct");

  const preload = [
    "assets/Me.jpeg",
    "assets/Me_2.jpeg",
    "assets/logo.png",
    "assets/logo-mark.png",
    "assets/warehouse.png",
    "assets/chat-app.png",
    "assets/bakes-by-mini.png",
    "assets/image.png",
    "assets/spotifyimage.png",
    "assets/coffeebar.png",
    "assets/Corno.png",
    "assets/trash.png",
    "assets/store.jpeg",
  ];

  function loadImage(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = img.onerror = () => resolve(src);
      img.src = src;
    });
  }

  async function runLoader() {
    let done = 0;
    const total = preload.length;
    const tick = () => {
      const pct = Math.round((done / total) * 100);
      if (loaderBar) loaderBar.style.width = `${pct}%`;
      if (loaderPct) loaderPct.textContent = String(pct).padStart(2, "0");
    };

    if (reduce) {
      done = total;
      tick();
    } else {
      tick();
      await Promise.all(
        preload.map((src) =>
          loadImage(src).then(() => {
            done += 1;
            tick();
          })
        )
      );
      await new Promise((r) => setTimeout(r, 220));
    }

    document.body.classList.add("is-ready");
    loader?.classList.add("is-done");
    setTimeout(() => loader?.setAttribute("aria-hidden", "true"), 900);
    initScroll();
  }

  function initTilt() {
    if (coarse || reduce) return;
    const cards = document.querySelectorAll(".tilt-card");
    const state = new Map();

    cards.forEach((card) => {
      state.set(card, { rx: 0, ry: 0, tx: 0, ty: 0 });
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const s = state.get(card);
        s.tx = (px - 0.5) * 2 * 5;
        s.ty = (py - 0.5) * 2 * -5;
        card.style.setProperty("--sx", `${e.clientX - r.left}px`);
        card.style.setProperty("--sy", `${e.clientY - r.top}px`);
      });
      card.addEventListener("pointerleave", () => {
        const s = state.get(card);
        s.tx = 0;
        s.ty = 0;
      });
    });

    const loop = () => {
      cards.forEach((card) => {
        const s = state.get(card);
        s.ry = lerp(s.ry, s.tx, 0.1);
        s.rx = lerp(s.rx, s.ty, 0.1);
        card.style.transform = `perspective(900px) rotateX(${s.rx}deg) rotateY(${s.ry}deg)`;
      });
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  function initMagnetic() {
    if (coarse || reduce) return;
    document.querySelectorAll(".magnetic").forEach((btn) => {
      const strength = 6;
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * 2 * strength;
        const y = ((e.clientY - r.top) / r.height - 0.5) * 2 * strength;
        btn.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
      btn.addEventListener("pointerleave", () => {
        btn.style.transform = "translate3d(0,0,0)";
      });
    });
  }

  function initNav() {
    const toggle = document.getElementById("nav-toggle");
    const panel = document.getElementById("nav-panel");
    const backdrop = document.getElementById("nav-backdrop");
    const mq = window.matchMedia("(max-width: 820px)");

    const setOpen = (open, restoreFocus = true) => {
      document.body.classList.toggle("menu-open", open);
      toggle?.setAttribute("aria-expanded", String(open));
      toggle?.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      if (mq.matches) {
        panel?.setAttribute("aria-hidden", String(!open));
      } else {
        panel?.setAttribute("aria-hidden", "true");
      }
      if (open && mq.matches) {
        panel?.querySelector(".nav-list a")?.focus();
      } else if (!open && restoreFocus && mq.matches) {
        toggle?.focus();
      }
    };

    const close = (restoreFocus = true) => setOpen(false, restoreFocus);

    toggle?.addEventListener("click", () => {
      setOpen(!document.body.classList.contains("menu-open"));
    });
    backdrop?.addEventListener("click", () => close(true));
    panel?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => close(false)));
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) close(true);
      if (e.key !== "Tab" || !document.body.classList.contains("menu-open") || !mq.matches) return;
      const nodes = [toggle, ...panel.querySelectorAll("a")].filter(Boolean);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
    mq.addEventListener("change", () => {
      if (!mq.matches) close(false);
    });
    if (mq.matches) panel?.setAttribute("aria-hidden", "true");
  }

  function showToast(title, detail = "", type = "ok") {
    const region = document.getElementById("toast-region");
    if (!region) return;
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.setAttribute("role", "status");

    const icon = document.createElement("span");
    icon.className = "toast-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = type === "ok" ? "✓" : "!";

    const copy = document.createElement("div");
    copy.className = "toast-copy";
    const heading = document.createElement("strong");
    heading.textContent = title;
    copy.appendChild(heading);
    if (detail) {
      const p = document.createElement("p");
      p.textContent = detail;
      copy.appendChild(p);
    }

    const closeBtn = document.createElement("button");
    closeBtn.className = "toast-close";
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "Dismiss notification");
    closeBtn.textContent = "×";

    toast.append(icon, copy, closeBtn);
    const dismiss = () => {
      toast.classList.remove("is-in");
      window.setTimeout(() => toast.remove(), 400);
    };
    closeBtn.addEventListener("click", dismiss);
    region.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("is-in"));
    window.setTimeout(dismiss, 5200);
  }

  function initScroll() {
    const fill = document.getElementById("scroll-progress");
    const hint = document.getElementById("scroll-hint");

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (fill) fill.style.height = `${p * 100}%`;
      if (hint) hint.classList.toggle("is-hidden", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const reveals = document.querySelectorAll(".reveal");
    if (reduce) {
      reveals.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  }

  function initForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;
    const status = document.getElementById("form-status");
    const submit = document.getElementById("contact-submit");

    const rules = {
      name: (v) => (/^[A-Za-zÀ-ÿ\s'.-]{3,80}$/.test(v) ? "" : "Please enter a valid name (3+ letters)."),
      email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter a valid email address."),
      subject: (v) => (v.length >= 3 ? "" : "Subject should be at least 3 characters."),
      message: (v) => (v.length >= 12 ? "" : "Message should be at least 12 characters."),
    };

    const showError = (name, msg) => {
      const input = form.elements[name];
      const field = input?.closest(".field");
      const err = form.querySelector(`.field-error[data-for="${name}"]`);
      field?.classList.toggle("is-invalid", Boolean(msg));
      if (err) err.textContent = msg;
    };

    const validate = () => {
      let ok = true;
      Object.keys(rules).forEach((key) => {
        const value = String(form.elements[key]?.value || "").trim();
        const msg = rules[key](value);
        showError(key, msg);
        if (msg) ok = false;
      });
      return ok;
    };

    Object.keys(rules).forEach((key) => {
      form.elements[key]?.addEventListener("blur", () => {
        const value = String(form.elements[key].value || "").trim();
        showError(key, rules[key](value));
      });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (status) {
        status.textContent = "";
        status.className = "form-status";
      }
      if (!validate()) {
        if (status) {
          status.textContent = "Please correct the highlighted fields.";
          status.classList.add("is-err");
        }
        showToast("Check the form", "Please correct the highlighted fields.", "err");
        return;
      }

      submit.disabled = true;
      const original = submit.textContent;
      submit.textContent = "Sending…";
      const payload = new FormData(form);

      try {
        const res = await fetch("contact.php", {
          method: "POST",
          body: payload,
          headers: { Accept: "application/json", "X-Requested-With": "XMLHttpRequest" },
        });
        let data = {};
        try {
          data = await res.json();
        } catch (_) {
          data = {};
        }
        if (res.ok && data.ok) {
          form.reset();
          Object.keys(rules).forEach((key) => showError(key, ""));
          if (status) {
            status.textContent = data.message || "Message received. I’ll get back to you shortly.";
            status.classList.add("is-ok");
          }
          showToast("Message sent", data.message || "I’ll get back to you shortly.");
        } else if (res.status === 404 || res.status === 405) {
          window.location.href = mailtoFromForm(form);
        } else {
          throw new Error(data.message || "Could not send just now.");
        }
      } catch (err) {
        if (err instanceof TypeError) {
          window.location.href = mailtoFromForm(form);
          return;
        }
        if (status) {
          status.textContent = err.message || "Something went wrong. Try email instead.";
          status.classList.add("is-err");
        }
        showToast("Couldn’t send", err.message || "Please try again or email me directly.", "err");
      } finally {
        submit.disabled = false;
        submit.textContent = original;
      }
    });
  }

  function mailtoFromForm(form) {
    const name = encodeURIComponent(form.elements.name.value.trim());
    const email = encodeURIComponent(form.elements.email.value.trim());
    const subject = encodeURIComponent(form.elements.subject.value.trim());
    const message = encodeURIComponent(form.elements.message.value.trim());
    const body = encodeURIComponent(
      `Name: ${decodeURIComponent(name)}\nEmail: ${decodeURIComponent(email)}\n\n${decodeURIComponent(message)}`
    );
    return `mailto:virshaarif59@gmail.com?subject=${subject}&body=${body}`;
  }

  document.addEventListener("DOMContentLoaded", () => {
    runLoader();
    initTilt();
    initMagnetic();
    initNav();
    initForm();
  });
})();
