(() => {
  const STORAGE_KEY = "cvmakerbd_state_v1";
  const PREVIEW_PREFS_KEY = "cvmakerbd_preview_prefs_v1";

  const defaultData = {
    personal: {
      name: "Sadia Rahman",
      title: "Senior Full-Stack Engineer",
      email: "sadia.rahman@example.com",
      phone: "+880 1712-345678",
      location: "Dhaka, Bangladesh",
      address: "Dhanmondi, Dhaka",
      website: "linkedin.com/in/sadiarahman",
      linkedin: "linkedin.com/in/sadiarahman",
      github: "github.com/sadiarahman",
      dateOfBirth: "15 March 1993",
      nationality: "Bangladeshi",
      summary:
        "Results-driven full-stack engineer with 9+ years of experience building scalable SaaS platforms. Led modernization initiatives that reduced release cycle time by 42% and improved platform reliability to 99.95% uptime.",
    },
    experience: [
      {
        role: "Senior Full-Stack Engineer",
        company: "Nexora Cloud Solutions",
        location: "Dhaka",
        startDate: "Jan 2021",
        endDate: "Present",
        highlights:
          "Architected a microservice migration strategy that cut average API response time by 37%.\nMentored 7 engineers and introduced engineering standards that reduced production defects by 28%.\nBuilt analytics dashboards used by leadership to optimize customer retention campaigns.",
      },
      {
        role: "Software Engineer",
        company: "Bridge Labs",
        location: "Remote",
        startDate: "Aug 2017",
        endDate: "Dec 2020",
        highlights:
          "Developed customer onboarding workflows that increased activation by 23%.\nImplemented CI/CD pipelines reducing deployment downtime by 65%.\nCollaborated with product and design teams to launch 12 high-impact features.",
      },
    ],
    education: [
      {
        degree: "BSc in Computer Science and Engineering",
        institution: "University of Dhaka",
        location: "Dhaka",
        startDate: "2012",
        endDate: "2016",
        details: "Graduated with distinction. Thesis on distributed systems reliability.",
      },
    ],
    skills: [
      { name: "JavaScript (ES6+)" },
      { name: "Node.js" },
      { name: "System Design" },
      { name: "PostgreSQL" },
      { name: "Docker" },
      { name: "AWS" },
      { name: "CI/CD" },
    ],
    projects: [
      {
        title: "Talent Pipeline Analytics Platform",
        tech: "JavaScript, Node.js, PostgreSQL, Docker",
        link: "github.com/sadiarahman/talent-analytics",
        details:
          "Built an internal analytics tool for recruitment workflows that reduced report generation time by 70% and improved hiring visibility for stakeholders.",
      },
    ],
    certifications: [
      {
        name: "AWS Certified Solutions Architect - Associate",
        issuer: "Amazon Web Services",
        year: "2023",
      },
    ],
    languages: [
      { name: "Bangla", level: "Native" },
      { name: "English", level: "Professional" },
    ],
    volunteer: [
      {
        role: "Mentor",
        organization: "Dhaka Code Club",
        location: "Dhaka",
        startDate: "2022",
        endDate: "Present",
        details:
          "Mentor junior developers on web fundamentals and career preparation through monthly workshops and code review sessions.",
      },
    ],
  };

  const dom = {
    body: document.body,
    saveStateBadge: document.getElementById("saveStateBadge"),
    form: document.getElementById("cvForm"),
    cvRoot: document.getElementById("cv-document-root"),
    paperFrame: document.getElementById("paperFrame"),
    experienceFields: document.getElementById("experienceFields"),
    educationFields: document.getElementById("educationFields"),
    skillsFields: document.getElementById("skillsFields"),
    projectsFields: document.getElementById("projectsFields"),
    certificationsFields: document.getElementById("certificationsFields"),
    languagesFields: document.getElementById("languagesFields"),
    volunteerFields: document.getElementById("volunteerFields"),
    addExperienceBtn: document.getElementById("addExperienceBtn"),
    addEducationBtn: document.getElementById("addEducationBtn"),
    addSkillBtn: document.getElementById("addSkillBtn"),
    addProjectBtn: document.getElementById("addProjectBtn"),
    addCertificationBtn: document.getElementById("addCertificationBtn"),
    addLanguageBtn: document.getElementById("addLanguageBtn"),
    addVolunteerBtn: document.getElementById("addVolunteerBtn"),
    resetDataBtn: document.getElementById("resetDataBtn"),
    downloadPdfBtn: document.getElementById("downloadPdfBtn"),
    mobileEditBtn: document.getElementById("mobileEditBtn"),
    mobilePreviewBtn: document.getElementById("mobilePreviewBtn"),
    fitWidthBtn: document.getElementById("fitWidthBtn"),
    fitPageBtn: document.getElementById("fitPageBtn"),
    contrastToggleBtn: document.getElementById("contrastToggleBtn"),
    quickJumpButtons: document.querySelectorAll("[data-scroll-target]"),
    countExperience: document.getElementById("countExperience"),
    countEducation: document.getElementById("countEducation"),
    countSkills: document.getElementById("countSkills"),
    countProjects: document.getElementById("countProjects"),
    panelToggleButtons: document.querySelectorAll("[data-toggle-panel]"),
  };

  const previewPrefs = {
    fitMode: "width",
    highContrast: false,
  };

  let lastSnapshot = null;
  let isApplyingUndo = false;

  const toSafeString = (value) => (value == null ? "" : String(value));

  const escapeHtml = (value) =>
    toSafeString(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

  const snapshotState = () =>
    deepClone({
      personal: state.personal,
      experience: state.experience,
      education: state.education,
      skills: state.skills,
      projects: state.projects,
      certifications: state.certifications,
      languages: state.languages,
      volunteer: state.volunteer,
    });

  const setUndoAvailability = () => {
    if (!dom.undoLastBtn) return;
    dom.undoLastBtn.disabled = !lastSnapshot;
  };

  const captureUndoSnapshot = () => {
    if (isApplyingUndo) return;
    lastSnapshot = snapshotState();
    setUndoAvailability();
  };

  const loadState = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return deepClone(defaultData);
      const parsed = JSON.parse(raw);
      return {
        personal: { ...deepClone(defaultData.personal), ...(parsed.personal || {}) },
        experience: Array.isArray(parsed.experience) && parsed.experience.length ? parsed.experience : deepClone(defaultData.experience),
        education: Array.isArray(parsed.education) && parsed.education.length ? parsed.education : deepClone(defaultData.education),
        skills: Array.isArray(parsed.skills) && parsed.skills.length ? parsed.skills : deepClone(defaultData.skills),
        projects: Array.isArray(parsed.projects) && parsed.projects.length ? parsed.projects : deepClone(defaultData.projects),
        certifications: Array.isArray(parsed.certifications) && parsed.certifications.length
          ? parsed.certifications
          : deepClone(defaultData.certifications),
        languages: Array.isArray(parsed.languages) && parsed.languages.length ? parsed.languages : deepClone(defaultData.languages),
        volunteer: Array.isArray(parsed.volunteer) && parsed.volunteer.length ? parsed.volunteer : deepClone(defaultData.volunteer),
      };
    } catch (error) {
      console.error("Failed to parse saved state", error);
      return deepClone(defaultData);
    }
  };

  const saveState = (state) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setSaveStateBadge("saved", "All changes saved");
    } catch (error) {
      console.error("Failed to save state", error);
      setSaveStateBadge("error", "Save issue");
    }
  };

  const setSaveStateBadge = (stateName, label) => {
    if (!dom.saveStateBadge) return;
    dom.saveStateBadge.dataset.state = stateName;
    dom.saveStateBadge.textContent = label;
  };

  const updateEditorStats = () => {
    if (dom.countExperience) dom.countExperience.textContent = String((state.experience || []).length);
    if (dom.countEducation) dom.countEducation.textContent = String((state.education || []).length);
    if (dom.countSkills) dom.countSkills.textContent = String((state.skills || []).length);
    if (dom.countProjects) dom.countProjects.textContent = String((state.projects || []).length);
  };

  const applyStateSnapshot = (snapshot) => {
    if (!snapshot) return;
    isApplyingUndo = true;
    state.personal = deepClone(snapshot.personal || defaultData.personal);
    state.experience = deepClone(snapshot.experience || defaultData.experience);
    state.education = deepClone(snapshot.education || defaultData.education);
    state.skills = deepClone(snapshot.skills || defaultData.skills);
    state.projects = deepClone(snapshot.projects || defaultData.projects);
    state.certifications = deepClone(snapshot.certifications || defaultData.certifications);
    state.languages = deepClone(snapshot.languages || defaultData.languages);
    state.volunteer = deepClone(snapshot.volunteer || defaultData.volunteer);
    isApplyingUndo = false;
  };

  const undoLastChange = () => {
    if (!lastSnapshot) return;
    const snapshot = deepClone(lastSnapshot);
    lastSnapshot = null;
    setUndoAvailability();
    applyStateSnapshot(snapshot);
    fillStaticInputs();
    renderDynamicInputs();
    renderCV();
    saveState(state);
    setSaveStateBadge("saved", "Last change undone");
  };

  const resetToSampleData = () => {
    const shouldReset = window.confirm("Reset all fields to sample data? Your current edits will be replaced.");
    if (!shouldReset) return;

    captureUndoSnapshot();

    const fresh = deepClone(defaultData);
    state.personal = fresh.personal;
    state.experience = fresh.experience;
    state.education = fresh.education;
    state.skills = fresh.skills;
    state.projects = fresh.projects;
    state.certifications = fresh.certifications;
    state.languages = fresh.languages;
    state.volunteer = fresh.volunteer;

    fillStaticInputs();
    renderDynamicInputs();
    renderCV();
    saveState(state);
    setSaveStateBadge("saved", "Reset to sample complete");
  };

  const loadPreviewPrefs = () => {
    try {
      const raw = localStorage.getItem(PREVIEW_PREFS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.fitMode === "page" || parsed.fitMode === "width") {
        previewPrefs.fitMode = parsed.fitMode;
      }
      previewPrefs.highContrast = Boolean(parsed.highContrast);
    } catch (error) {
      console.error("Failed to parse preview preferences", error);
    }
  };

  const savePreviewPrefs = () => {
    try {
      localStorage.setItem(PREVIEW_PREFS_KEY, JSON.stringify(previewPrefs));
    } catch (error) {
      console.error("Failed to save preview preferences", error);
    }
  };

  const proxyCache = new WeakMap();
  const createReactiveProxy = (target, onChange) => {
    if (target === null || typeof target !== "object") return target;
    if (proxyCache.has(target)) return proxyCache.get(target);

    const proxy = new Proxy(target, {
      get(obj, prop) {
        const value = Reflect.get(obj, prop);
        return createReactiveProxy(value, onChange);
      },
      set(obj, prop, value) {
        const oldValue = obj[prop];
        if (oldValue === value) return true;
        const result = Reflect.set(obj, prop, value);
        onChange();
        return result;
      },
      deleteProperty(obj, prop) {
        const result = Reflect.deleteProperty(obj, prop);
        onChange();
        return result;
      },
    });

    proxyCache.set(target, proxy);
    return proxy;
  };

  const state = createReactiveProxy(loadState(), () => {
    setSaveStateBadge("saving", "Saving...");
    renderCV();
    saveState(state);
    queueScaleRefresh();
    updateEditorStats();
  });

  const setByPath = (obj, path, value) => {
    const keys = path.split(".");
    const leaf = keys.pop();
    let node = obj;
    keys.forEach((key) => {
      if (!node[key] || typeof node[key] !== "object") node[key] = {};
      node = node[key];
    });
    node[leaf] = value;
  };

  const fillStaticInputs = () => {
    const fields = dom.form.querySelectorAll("[data-path]");
    fields.forEach((field) => {
      const path = field.dataset.path;
      const value = path.split(".").reduce((acc, key) => (acc ? acc[key] : ""), state);
      field.value = toSafeString(value);
    });
  };

  const renderExperienceInputs = () => {
    dom.experienceFields.innerHTML = state.experience
      .map(
        (item, index) => `
          <div class="dynamic-item">
            <div class="dynamic-item-head">
              <p class="dynamic-item-title">Experience ${index + 1}</p>
              <button class="btn btn-sm btn-outline-danger" type="button" data-action="remove-experience" data-index="${index}">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
            <div class="row g-2">
              <div class="col-12 col-md-6">
                <label class="form-label">Role</label>
                <input class="form-control" type="text" value="${escapeHtml(item.role)}" data-collection="experience" data-index="${index}" data-field="role" />
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">Company</label>
                <input class="form-control" type="text" value="${escapeHtml(item.company)}" data-collection="experience" data-index="${index}" data-field="company" />
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">Location</label>
                <input class="form-control" type="text" value="${escapeHtml(item.location)}" data-collection="experience" data-index="${index}" data-field="location" />
              </div>
              <div class="col-6 col-md-3">
                <label class="form-label">Start</label>
                <input class="form-control" type="text" value="${escapeHtml(item.startDate)}" data-collection="experience" data-index="${index}" data-field="startDate" />
              </div>
              <div class="col-6 col-md-3">
                <label class="form-label">End</label>
                <input class="form-control" type="text" value="${escapeHtml(item.endDate)}" data-collection="experience" data-index="${index}" data-field="endDate" />
              </div>
              <div class="col-12">
                <label class="form-label">Highlights (one bullet per line)</label>
                <textarea class="form-control" rows="4" data-collection="experience" data-index="${index}" data-field="highlights">${escapeHtml(item.highlights)}</textarea>
              </div>
            </div>
          </div>
        `
      )
      .join("");
  };

  const renderEducationInputs = () => {
    dom.educationFields.innerHTML = state.education
      .map(
        (item, index) => `
          <div class="dynamic-item">
            <div class="dynamic-item-head">
              <p class="dynamic-item-title">Education ${index + 1}</p>
              <button class="btn btn-sm btn-outline-danger" type="button" data-action="remove-education" data-index="${index}">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
            <div class="row g-2">
              <div class="col-12 col-md-6">
                <label class="form-label">Degree</label>
                <input class="form-control" type="text" value="${escapeHtml(item.degree)}" data-collection="education" data-index="${index}" data-field="degree" />
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">Institution</label>
                <input class="form-control" type="text" value="${escapeHtml(item.institution)}" data-collection="education" data-index="${index}" data-field="institution" />
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">Location</label>
                <input class="form-control" type="text" value="${escapeHtml(item.location)}" data-collection="education" data-index="${index}" data-field="location" />
              </div>
              <div class="col-6 col-md-3">
                <label class="form-label">Start</label>
                <input class="form-control" type="text" value="${escapeHtml(item.startDate)}" data-collection="education" data-index="${index}" data-field="startDate" />
              </div>
              <div class="col-6 col-md-3">
                <label class="form-label">End</label>
                <input class="form-control" type="text" value="${escapeHtml(item.endDate)}" data-collection="education" data-index="${index}" data-field="endDate" />
              </div>
              <div class="col-12">
                <label class="form-label">Notes</label>
                <textarea class="form-control" rows="3" data-collection="education" data-index="${index}" data-field="details">${escapeHtml(item.details)}</textarea>
              </div>
            </div>
          </div>
        `
      )
      .join("");
  };

  const renderSkillInputs = () => {
    dom.skillsFields.innerHTML = state.skills
      .map(
        (item, index) => `
          <div class="dynamic-item">
            <div class="dynamic-item-head">
              <p class="dynamic-item-title">Skill ${index + 1}</p>
              <button class="btn btn-sm btn-outline-danger" type="button" data-action="remove-skill" data-index="${index}">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
            <label class="form-label">Skill Name</label>
            <input class="form-control" type="text" value="${escapeHtml(item.name)}" data-collection="skills" data-index="${index}" data-field="name" />
          </div>
        `
      )
      .join("");
  };

  const renderProjectInputs = () => {
    dom.projectsFields.innerHTML = state.projects
      .map(
        (item, index) => `
          <div class="dynamic-item">
            <div class="dynamic-item-head">
              <p class="dynamic-item-title">Project ${index + 1}</p>
              <button class="btn btn-sm btn-outline-danger" type="button" data-action="remove-project" data-index="${index}">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
            <div class="row g-2">
              <div class="col-12 col-md-6">
                <label class="form-label">Project Title</label>
                <input class="form-control" type="text" value="${escapeHtml(item.title)}" data-collection="projects" data-index="${index}" data-field="title" />
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">Tech Stack</label>
                <input class="form-control" type="text" value="${escapeHtml(item.tech)}" data-collection="projects" data-index="${index}" data-field="tech" />
              </div>
              <div class="col-12">
                <label class="form-label">Project Link</label>
                <input class="form-control" type="text" value="${escapeHtml(item.link)}" data-collection="projects" data-index="${index}" data-field="link" />
              </div>
              <div class="col-12">
                <label class="form-label">Description</label>
                <textarea class="form-control" rows="3" data-collection="projects" data-index="${index}" data-field="details">${escapeHtml(item.details)}</textarea>
              </div>
            </div>
          </div>
        `
      )
      .join("");
  };

  const renderCertificationInputs = () => {
    dom.certificationsFields.innerHTML = state.certifications
      .map(
        (item, index) => `
          <div class="dynamic-item">
            <div class="dynamic-item-head">
              <p class="dynamic-item-title">Certification ${index + 1}</p>
              <button class="btn btn-sm btn-outline-danger" type="button" data-action="remove-certification" data-index="${index}">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
            <div class="row g-2">
              <div class="col-12 col-md-6">
                <label class="form-label">Certification Name</label>
                <input class="form-control" type="text" value="${escapeHtml(item.name)}" data-collection="certifications" data-index="${index}" data-field="name" />
              </div>
              <div class="col-12 col-md-4">
                <label class="form-label">Issuer</label>
                <input class="form-control" type="text" value="${escapeHtml(item.issuer)}" data-collection="certifications" data-index="${index}" data-field="issuer" />
              </div>
              <div class="col-12 col-md-2">
                <label class="form-label">Year</label>
                <input class="form-control" type="text" value="${escapeHtml(item.year)}" data-collection="certifications" data-index="${index}" data-field="year" />
              </div>
            </div>
          </div>
        `
      )
      .join("");
  };

  const renderLanguageInputs = () => {
    dom.languagesFields.innerHTML = state.languages
      .map(
        (item, index) => `
          <div class="dynamic-item">
            <div class="dynamic-item-head">
              <p class="dynamic-item-title">Language ${index + 1}</p>
              <button class="btn btn-sm btn-outline-danger" type="button" data-action="remove-language" data-index="${index}">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
            <div class="row g-2">
              <div class="col-12 col-md-7">
                <label class="form-label">Language</label>
                <input class="form-control" type="text" value="${escapeHtml(item.name)}" data-collection="languages" data-index="${index}" data-field="name" />
              </div>
              <div class="col-12 col-md-5">
                <label class="form-label">Proficiency</label>
                <input class="form-control" type="text" value="${escapeHtml(item.level)}" data-collection="languages" data-index="${index}" data-field="level" />
              </div>
            </div>
          </div>
        `
      )
      .join("");
  };

  const renderVolunteerInputs = () => {
    dom.volunteerFields.innerHTML = state.volunteer
      .map(
        (item, index) => `
          <div class="dynamic-item">
            <div class="dynamic-item-head">
              <p class="dynamic-item-title">Volunteer Role ${index + 1}</p>
              <button class="btn btn-sm btn-outline-danger" type="button" data-action="remove-volunteer" data-index="${index}">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
            <div class="row g-2">
              <div class="col-12 col-md-6">
                <label class="form-label">Role</label>
                <input class="form-control" type="text" value="${escapeHtml(item.role)}" data-collection="volunteer" data-index="${index}" data-field="role" />
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">Organization</label>
                <input class="form-control" type="text" value="${escapeHtml(item.organization)}" data-collection="volunteer" data-index="${index}" data-field="organization" />
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">Location</label>
                <input class="form-control" type="text" value="${escapeHtml(item.location)}" data-collection="volunteer" data-index="${index}" data-field="location" />
              </div>
              <div class="col-6 col-md-3">
                <label class="form-label">Start</label>
                <input class="form-control" type="text" value="${escapeHtml(item.startDate)}" data-collection="volunteer" data-index="${index}" data-field="startDate" />
              </div>
              <div class="col-6 col-md-3">
                <label class="form-label">End</label>
                <input class="form-control" type="text" value="${escapeHtml(item.endDate)}" data-collection="volunteer" data-index="${index}" data-field="endDate" />
              </div>
              <div class="col-12">
                <label class="form-label">Description</label>
                <textarea class="form-control" rows="3" data-collection="volunteer" data-index="${index}" data-field="details">${escapeHtml(item.details)}</textarea>
              </div>
            </div>
          </div>
        `
      )
      .join("");
  };

  const renderDynamicInputs = () => {
    renderExperienceInputs();
    renderEducationInputs();
    renderSkillInputs();
    renderProjectInputs();
    renderCertificationInputs();
    renderLanguageInputs();
    renderVolunteerInputs();
    updateEditorStats();
  };

  const textOrPlaceholder = (value, fallback) => {
    const v = toSafeString(value).trim();
    return v || fallback;
  };

  const toBullets = (text) =>
    toSafeString(text)
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

  const renderCV = () => {
    const personal = state.personal || {};

    const contactPrimary = [
      toSafeString(personal.email),
      toSafeString(personal.phone),
      toSafeString(personal.location),
    ].filter(Boolean);

    const contactSecondary = [
      toSafeString(personal.address),
      toSafeString(personal.website),
      toSafeString(personal.linkedin),
      toSafeString(personal.github),
      personal.dateOfBirth ? `DOB: ${toSafeString(personal.dateOfBirth)}` : "",
      personal.nationality ? `Nationality: ${toSafeString(personal.nationality)}` : "",
    ].filter(Boolean);

    const experiences = (state.experience || [])
      .filter((item) => toSafeString(item.role) || toSafeString(item.company) || toSafeString(item.highlights))
      .map((item) => {
        const bullets = toBullets(item.highlights)
          .map((point) => `<li>${escapeHtml(point)}</li>`)
          .join("");

        const metaParts = [toSafeString(item.company), toSafeString(item.location)].filter(Boolean);
        const date = [toSafeString(item.startDate), toSafeString(item.endDate)].filter(Boolean).join(" - ");

        return `
          <article class="cv-entry">
            <div class="cv-entry-header">
              <h3 class="cv-entry-role">${escapeHtml(textOrPlaceholder(item.role, "Role"))}</h3>
              <p class="cv-entry-date">${escapeHtml(date)}</p>
            </div>
            <p class="cv-entry-meta">${escapeHtml(metaParts.join(" | "))}</p>
            ${bullets ? `<ul class="cv-entry-list">${bullets}</ul>` : ""}
          </article>
        `;
      })
      .join("");

    const educationEntries = (state.education || [])
      .filter((item) => toSafeString(item.degree) || toSafeString(item.institution))
      .map((item) => {
        const date = [toSafeString(item.startDate), toSafeString(item.endDate)].filter(Boolean).join(" - ");
        const metaParts = [toSafeString(item.institution), toSafeString(item.location)].filter(Boolean);
        return `
          <article class="cv-entry">
            <div class="cv-entry-header">
              <h3 class="cv-entry-role">${escapeHtml(textOrPlaceholder(item.degree, "Degree"))}</h3>
              <p class="cv-entry-date">${escapeHtml(date)}</p>
            </div>
            <p class="cv-entry-meta">${escapeHtml(metaParts.join(" | "))}</p>
            ${item.details ? `<p class="cv-summary">${escapeHtml(item.details)}</p>` : ""}
          </article>
        `;
      })
      .join("");

    const skills = (state.skills || [])
      .map((item) => toSafeString(item.name).trim())
      .filter(Boolean)
      .map((name) => `<span class="cv-skill-chip">${escapeHtml(name)}</span>`)
      .join("");

    const projects = (state.projects || [])
      .filter((item) => toSafeString(item.title) || toSafeString(item.details))
      .map((item) => {
        const metaParts = [toSafeString(item.tech), toSafeString(item.link)].filter(Boolean);
        return `
          <article class="cv-entry">
            <div class="cv-entry-header">
              <h3 class="cv-entry-role">${escapeHtml(textOrPlaceholder(item.title, "Project"))}</h3>
            </div>
            ${metaParts.length ? `<p class="cv-entry-meta">${escapeHtml(metaParts.join(" | "))}</p>` : ""}
            ${item.details ? `<p class="cv-summary">${escapeHtml(item.details)}</p>` : ""}
          </article>
        `;
      })
      .join("");

    const certifications = (state.certifications || [])
      .filter((item) => toSafeString(item.name))
      .map((item) => {
        const meta = [toSafeString(item.issuer), toSafeString(item.year)].filter(Boolean).join(" | ");
        return `
          <article class="cv-entry">
            <h3 class="cv-entry-role">${escapeHtml(item.name)}</h3>
            ${meta ? `<p class="cv-entry-meta">${escapeHtml(meta)}</p>` : ""}
          </article>
        `;
      })
      .join("");

    const languages = (state.languages || [])
      .filter((item) => toSafeString(item.name))
      .map((item) => {
        const label = [toSafeString(item.name), toSafeString(item.level)].filter(Boolean).join(" - ");
        return `<span class="cv-skill-chip">${escapeHtml(label)}</span>`;
      })
      .join("");

    const volunteer = (state.volunteer || [])
      .filter((item) => toSafeString(item.role) || toSafeString(item.organization) || toSafeString(item.details))
      .map((item) => {
        const metaParts = [toSafeString(item.organization), toSafeString(item.location)].filter(Boolean);
        const date = [toSafeString(item.startDate), toSafeString(item.endDate)].filter(Boolean).join(" - ");
        return `
          <article class="cv-entry">
            <div class="cv-entry-header">
              <h3 class="cv-entry-role">${escapeHtml(textOrPlaceholder(item.role, "Volunteer Role"))}</h3>
              <p class="cv-entry-date">${escapeHtml(date)}</p>
            </div>
            ${metaParts.length ? `<p class="cv-entry-meta">${escapeHtml(metaParts.join(" | "))}</p>` : ""}
            ${item.details ? `<p class="cv-summary">${escapeHtml(item.details)}</p>` : ""}
          </article>
        `;
      })
      .join("");

    dom.cvRoot.innerHTML = `
      <div class="cv-inner">
        <header class="cv-header">
          <h1 class="cv-name">${escapeHtml(textOrPlaceholder(personal.name, "Your Name"))}</h1>
          <p class="cv-title">${escapeHtml(textOrPlaceholder(personal.title, "Professional Title"))}</p>
          <p class="cv-contact">${escapeHtml(contactPrimary.join(" | "))}</p>
          ${contactSecondary.length ? `<p class="cv-contact cv-contact-secondary">${escapeHtml(contactSecondary.join(" | "))}</p>` : ""}
        </header>

        <section class="cv-section">
          <h2>Professional Summary</h2>
          <p class="cv-summary">${escapeHtml(textOrPlaceholder(personal.summary, "Add a concise summary of your profile and impact."))}</p>
        </section>

        <section class="cv-section">
          <h2>Work Experience</h2>
          ${
            experiences ||
            `<p class="cv-summary">Add work entries with measurable outcomes and responsibilities.</p>`
          }
        </section>

        <section class="cv-section">
          <h2>Education</h2>
          ${educationEntries || `<p class="cv-summary">Add your educational background here.</p>`}
        </section>

        <section class="cv-section">
          <h2>Skills</h2>
          <div class="cv-skills">${skills || `<span class="cv-summary">Add relevant technical and soft skills.</span>`}</div>
        </section>

        <section class="cv-section">
          <h2>Projects</h2>
          ${projects || `<p class="cv-summary">Add key projects with outcomes and technology context.</p>`}
        </section>

        <section class="cv-section">
          <h2>Certifications</h2>
          ${certifications || `<p class="cv-summary">Add professional certifications here.</p>`}
        </section>

        <section class="cv-section">
          <h2>Languages</h2>
          <div class="cv-skills">${languages || `<span class="cv-summary">Add spoken or written languages with proficiency.</span>`}</div>
        </section>

        <section class="cv-section">
          <h2>Volunteer Experience</h2>
          ${volunteer || `<p class="cv-summary">Add volunteer roles, impact, and community contributions.</p>`}
        </section>
      </div>
    `;
  };

  let scaleRaf = 0;

  const syncPreviewControlUI = () => {
    if (dom.fitWidthBtn && dom.fitPageBtn) {
      const widthActive = previewPrefs.fitMode === "width";
      dom.fitWidthBtn.classList.toggle("btn-brand", widthActive);
      dom.fitWidthBtn.classList.toggle("btn-outline-brand", !widthActive);
      dom.fitPageBtn.classList.toggle("btn-brand", !widthActive);
      dom.fitPageBtn.classList.toggle("btn-outline-brand", widthActive);
      dom.fitWidthBtn.setAttribute("aria-pressed", String(widthActive));
      dom.fitPageBtn.setAttribute("aria-pressed", String(!widthActive));
    }

    if (dom.contrastToggleBtn) {
      const active = previewPrefs.highContrast;
      dom.contrastToggleBtn.classList.toggle("btn-brand", active);
      dom.contrastToggleBtn.classList.toggle("btn-outline-brand", !active);
      dom.contrastToggleBtn.setAttribute("aria-pressed", String(active));
    }
  };

  const applyPreviewPrefs = () => {
    dom.body.dataset.previewFit = previewPrefs.fitMode;
    dom.body.dataset.previewContrast = previewPrefs.highContrast ? "high" : "normal";
    syncPreviewControlUI();
    queueScaleRefresh();
  };

  const setPreviewFitMode = (fitMode) => {
    if (fitMode !== "width" && fitMode !== "page") return;
    previewPrefs.fitMode = fitMode;
    savePreviewPrefs();
    applyPreviewPrefs();
  };

  const togglePreviewContrast = () => {
    previewPrefs.highContrast = !previewPrefs.highContrast;
    savePreviewPrefs();
    applyPreviewPrefs();
  };

  const refreshPaperScale = () => {
    if (!dom.paperFrame || !dom.cvRoot) return;
    const frameStyles = window.getComputedStyle(dom.paperFrame);
    const paddingLeft = parseFloat(frameStyles.paddingLeft) || 0;
    const paddingRight = parseFloat(frameStyles.paddingRight) || 0;
    const paddingTop = parseFloat(frameStyles.paddingTop) || 0;
    const paddingBottom = parseFloat(frameStyles.paddingBottom) || 0;
    const frameWidth = dom.paperFrame.clientWidth - paddingLeft - paddingRight;
    const frameHeight = dom.paperFrame.clientHeight - paddingTop - paddingBottom;
    if (frameWidth <= 0 || frameHeight <= 0) return;

    const paperWidth = dom.cvRoot.offsetWidth || 1;
    const paperHeight = dom.cvRoot.offsetHeight || 1;
    const widthScale = frameWidth / paperWidth;
    const heightScale = frameHeight / paperHeight;

    const scale =
      previewPrefs.fitMode === "page"
        ? Math.min(1, widthScale, heightScale)
        : Math.min(1, widthScale);

    if (!Number.isFinite(scale) || scale <= 0) return;
    dom.cvRoot.style.setProperty("--paper-scale", String(scale));
  };

  const queueScaleRefresh = () => {
    if (scaleRaf) cancelAnimationFrame(scaleRaf);
    scaleRaf = requestAnimationFrame(refreshPaperScale);
  };

  const addExperience = () => {
    captureUndoSnapshot();
    state.experience.push({
      role: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      highlights: "",
    });
    renderDynamicInputs();
  };

  const addEducation = () => {
    captureUndoSnapshot();
    state.education.push({
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      details: "",
    });
    renderDynamicInputs();
  };

  const addSkill = () => {
    captureUndoSnapshot();
    state.skills.push({ name: "" });
    renderDynamicInputs();
  };

  const addProject = () => {
    captureUndoSnapshot();
    state.projects.push({
      title: "",
      tech: "",
      link: "",
      details: "",
    });
    renderDynamicInputs();
  };

  const addCertification = () => {
    captureUndoSnapshot();
    state.certifications.push({
      name: "",
      issuer: "",
      year: "",
    });
    renderDynamicInputs();
  };

  const addLanguage = () => {
    captureUndoSnapshot();
    state.languages.push({
      name: "",
      level: "",
    });
    renderDynamicInputs();
  };

  const addVolunteer = () => {
    captureUndoSnapshot();
    state.volunteer.push({
      role: "",
      organization: "",
      location: "",
      startDate: "",
      endDate: "",
      details: "",
    });
    renderDynamicInputs();
  };

  const handleFormInput = (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;

    const directPath = target.dataset.path;
    if (directPath) {
      captureUndoSnapshot();
      setByPath(state, directPath, target.value);
      return;
    }

    const collection = target.dataset.collection;
    const index = Number(target.dataset.index);
    const field = target.dataset.field;

    if (!collection || Number.isNaN(index) || !field) return;
    if (!Array.isArray(state[collection])) return;
    if (!state[collection][index]) return;

    captureUndoSnapshot();
    state[collection][index][field] = target.value;
  };

  const handleFormClick = (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const index = Number(button.dataset.index);
    if (Number.isNaN(index)) return;

    const action = button.dataset.action;

    if (action === "remove-experience") {
      captureUndoSnapshot();
      state.experience.splice(index, 1);
      if (!state.experience.length) addExperience();
      renderDynamicInputs();
      return;
    }

    if (action === "remove-education") {
      captureUndoSnapshot();
      state.education.splice(index, 1);
      if (!state.education.length) addEducation();
      renderDynamicInputs();
      return;
    }

    if (action === "remove-skill") {
      captureUndoSnapshot();
      state.skills.splice(index, 1);
      if (!state.skills.length) addSkill();
      renderDynamicInputs();
      return;
    }

    if (action === "remove-project") {
      captureUndoSnapshot();
      state.projects.splice(index, 1);
      if (!state.projects.length) addProject();
      renderDynamicInputs();
      return;
    }

    if (action === "remove-certification") {
      captureUndoSnapshot();
      state.certifications.splice(index, 1);
      if (!state.certifications.length) addCertification();
      renderDynamicInputs();
      return;
    }

    if (action === "remove-language") {
      captureUndoSnapshot();
      state.languages.splice(index, 1);
      if (!state.languages.length) addLanguage();
      renderDynamicInputs();
      return;
    }

    if (action === "remove-volunteer") {
      captureUndoSnapshot();
      state.volunteer.splice(index, 1);
      if (!state.volunteer.length) addVolunteer();
      renderDynamicInputs();
    }
  };

  const setMobileMode = (mode) => {
    dom.body.dataset.mobileMode = mode;
    const isEdit = mode === "edit";
    dom.mobileEditBtn.classList.toggle("active", isEdit);
    dom.mobileEditBtn.classList.toggle("btn-brand", isEdit);
    dom.mobileEditBtn.classList.toggle("btn-outline-brand", !isEdit);
    dom.mobilePreviewBtn.classList.toggle("active", !isEdit);
    dom.mobilePreviewBtn.classList.toggle("btn-brand", !isEdit);
    dom.mobilePreviewBtn.classList.toggle("btn-outline-brand", isEdit);

    if (!isEdit) queueScaleRefresh();
  };

  const togglePanelBody = (button) => {
    const bodyId = button.dataset.togglePanel;
    if (!bodyId) return;
    const body = document.getElementById(bodyId);
    if (!body) return;
    const expanded = button.getAttribute("aria-expanded") === "true";
    const nextExpanded = !expanded;
    button.setAttribute("aria-expanded", String(nextExpanded));
    body.hidden = !nextExpanded;
    button.classList.toggle("is-expanded", nextExpanded);

    const icon = button.querySelector("i");
    if (icon) {
      icon.classList.remove("fa-minus", "fa-xmark", "fa-chevron-up", "fa-chevron-down");
      icon.classList.add("fa-plus");
    }

    button.classList.remove("is-toggling");
    void button.offsetWidth;
    button.classList.add("is-toggling");
  };

  const handleGlobalShortcuts = (event) => {
    if (!(event.ctrlKey || event.metaKey)) return;
    if (event.altKey) return;

    const key = String(event.key || "").toLowerCase();
    if (key !== "s") return;

    event.preventDefault();
    downloadPDF();
  };

  const setBusy = (button, busy, labelBusy, labelIdle) => {
    button.disabled = busy;
    button.innerHTML = busy ? `<i class="fa-solid fa-spinner fa-spin me-2"></i>${labelBusy}` : labelIdle;
  };

  const downloadPDF = async () => {
    if (typeof window.html2canvas !== "function" || !window.jspdf || typeof window.jspdf.jsPDF !== "function") {
      alert("PDF library failed to load. Please check your internet connection and try again.");
      return;
    }

    setBusy(dom.downloadPdfBtn, true, "Building PDF...", '<i class="fa-solid fa-file-pdf me-2"></i>Download PDF');
    const oldScale = dom.cvRoot.style.getPropertyValue("--paper-scale");

    try {
      dom.cvRoot.style.setProperty("--paper-scale", "1");

      // Render once to a canvas and fit it into a single A4 page.
      const canvas = await window.html2canvas(dom.cvRoot, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const pdf = new window.jspdf.jsPDF({
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      let renderWidth = pageWidth;
      let renderHeight = (canvas.height * renderWidth) / canvas.width;

      // Ensure full content always fits on a single page without cropping.
      if (renderHeight > pageHeight) {
        renderHeight = pageHeight;
        renderWidth = (canvas.width * renderHeight) / canvas.height;
      }

      const offsetX = (pageWidth - renderWidth) / 2;
      const offsetY = (pageHeight - renderHeight) / 2;
      pdf.addImage(imgData, "JPEG", offsetX, offsetY, renderWidth, renderHeight, undefined, "FAST");
      pdf.save("professional_resume.pdf");
    } catch (error) {
      console.error(error);
      alert("Could not generate PDF. Please try again.");
    } finally {
      dom.cvRoot.style.setProperty("--paper-scale", oldScale || "1");
      setBusy(dom.downloadPdfBtn, false, "", '<i class="fa-solid fa-file-pdf me-2"></i>Download PDF');
      queueScaleRefresh();
    }
  };

  const attachListeners = () => {
    dom.form.addEventListener("input", handleFormInput);
    dom.form.addEventListener("click", handleFormClick);

    dom.addExperienceBtn.addEventListener("click", addExperience);
    dom.addEducationBtn.addEventListener("click", addEducation);
    dom.addSkillBtn.addEventListener("click", addSkill);
    dom.addProjectBtn.addEventListener("click", addProject);
    dom.addCertificationBtn.addEventListener("click", addCertification);
    dom.addLanguageBtn.addEventListener("click", addLanguage);
    dom.addVolunteerBtn.addEventListener("click", addVolunteer);

    dom.downloadPdfBtn.addEventListener("click", downloadPDF);

    dom.mobileEditBtn.addEventListener("click", () => setMobileMode("edit"));
    dom.mobilePreviewBtn.addEventListener("click", () => setMobileMode("preview"));

    if (dom.fitWidthBtn) {
      dom.fitWidthBtn.addEventListener("click", () => setPreviewFitMode("width"));
    }
    if (dom.fitPageBtn) {
      dom.fitPageBtn.addEventListener("click", () => setPreviewFitMode("page"));
    }
    if (dom.contrastToggleBtn) {
      dom.contrastToggleBtn.addEventListener("click", togglePreviewContrast);
    }

    if (dom.resetDataBtn) {
      dom.resetDataBtn.addEventListener("click", resetToSampleData);
    }

    if (dom.undoLastBtn) {
      dom.undoLastBtn.addEventListener("click", undoLastChange);
    }

    if (dom.panelToggleButtons && dom.panelToggleButtons.length) {
      dom.panelToggleButtons.forEach((button) => {
        const icon = button.querySelector("i");
        const expanded = button.getAttribute("aria-expanded") === "true";
        button.classList.toggle("is-expanded", expanded);

        if (icon) {
          icon.classList.remove("fa-minus", "fa-xmark", "fa-chevron-up", "fa-chevron-down");
          icon.classList.add("fa-plus");
        }

        button.addEventListener("click", () => togglePanelBody(button));
      });
    }

    if (dom.quickJumpButtons && dom.quickJumpButtons.length) {
      dom.quickJumpButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const targetId = button.dataset.scrollTarget;
          if (!targetId) return;
          const section = document.getElementById(targetId);
          if (!section) return;
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
    }

    window.addEventListener("resize", queueScaleRefresh);
    window.addEventListener("keydown", handleGlobalShortcuts);
  };

  const init = () => {
    loadPreviewPrefs();
    fillStaticInputs();
    renderDynamicInputs();
    renderCV();
    attachListeners();
    applyPreviewPrefs();
    updateEditorStats();
    setSaveStateBadge("saved", "All changes saved");
    setUndoAvailability();

    setMobileMode("edit");
    queueScaleRefresh();
  };

  init();
})();
