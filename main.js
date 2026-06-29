// ============================================
// Configuration
// ============================================

// Base URL where images are hosted (without trailing slash).
// Uses local origin in dev so images load without cross-origin issues.
const IMAGE_BASE_URL =
	window.location.hostname === "localhost" ||
	window.location.hostname === "127.0.0.1"
		? window.location.origin
		: "https://roryharnden.github.io/if-email-sig";

const CONFIG = {
	logo: {
		file: "if_logo@2x-8.png",
		alt: "Indigenous Futures",
		url: "https://if.org.nz",
		width: 200,
	},
	urls: [{ url: "https://if.org.nz", display: "if.org.nz" }],
	features: {
		logoLinksToWebsite: false, // wrap logo in an <a> tag
		showWebsiteUrl: false,     // show the URL row below the logo
	},
};

// ============================================
// Get colors from CSS variables
// ============================================

function getColors() {
	const style = getComputedStyle(document.documentElement);
	return {
		textPrimary: style.getPropertyValue("--neutral-dark").trim(),
		textSecondary: style.getPropertyValue("--neutral").trim(),
		textMuted: style.getPropertyValue("--neutral").trim(),
		link: style.getPropertyValue("--primary").trim(),
		linkHover: style.getPropertyValue("--primary-hover").trim(),
		border: style.getPropertyValue("--neutral-light").trim(),
	};
}

// ============================================
// Form Elements
// ============================================

const form = document.getElementById("signature-form");
const previewArea = document.getElementById("preview");
const copyButton = document.getElementById("copy-button");
const copyFeedback = document.getElementById("copy-feedback");

// Form fields
const nameField = document.getElementById("name");
const jobTitleField = document.getElementById("jobTitle");
const jobTitleMaoriField = document.getElementById("jobTitleMaori");
const emailField = document.getElementById("email");
const phoneField = document.getElementById("phone");
const notesField = document.getElementById("notes");

// ============================================
// Signature Generator
// ============================================

function generateSignature(formData) {
	const COLORS = getColors();

	// Use absolute URL for images in email signature
	const imagePath = `${IMAGE_BASE_URL}/images`;

	// Build te reo job title row (only if provided)
	const maoriTitleRow = formData.jobTitleMaori
		? `
        <tr>
            <td style="font-size: 14px; line-height: 1.5; color: ${
				COLORS.textSecondary
			}; padding: 0; margin: 0;">
                ${escapeHtml(formData.jobTitleMaori)}
            </td>
        </tr>`
		: "";

	const logo = CONFIG.logo;
	const logoImg = `<img src="${imagePath}/${logo.file}" alt="${logo.alt}" width="${logo.width}" style="display: block; max-width: ${logo.width}px; height: auto; border: 0;">`;
	const logoContent = CONFIG.features.logoLinksToWebsite
		? `<a href="${logo.url}" target="_blank" style="display: block; text-decoration: none;">${logoImg}</a>`
		: logoImg;
	const logoSection = `
                <tr>
                    <td style="padding: 16px 0 4px 0;">
                        <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td>${logoContent}</td>
                            </tr>
                        </table>
                    </td>
                </tr>`;

	// Generate complete signature HTML
	const signatureHTML = `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.5; color: ${
		COLORS.textPrimary
	};">
    <tr>
        <td style="padding: 0; padding-bottom: 12px;">
            <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td style="font-size: 16px; font-weight: 600; line-height: 1.5; color: ${
						COLORS.textPrimary
					}; padding: 0; margin: 0;">
                        ${escapeHtml(formData.name)}
                    </td>
                </tr>
                <tr>
                    <td style="font-size: 14px; line-height: 1.5; color: ${
						COLORS.textSecondary
					}; padding: 0; margin: 0;">
                        ${escapeHtml(formData.jobTitle)}
                    </td>
                </tr>${maoriTitleRow}
            </table>
        </td>
    </tr>
    <tr>
        <td style="padding: 0;">
            <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td style="font-size: 14px; line-height: 1.5; color: ${
						COLORS.textPrimary
					}; padding: 0; margin: 0;">
                        <a href="mailto:${escapeHtml(
							formData.email
						)}" style="color: ${
		COLORS.link
	}; text-decoration: none;">${escapeHtml(formData.email)}</a>
                    </td>
                </tr>
                <tr>
                    <td style="font-size: 14px; line-height: 1.5; color: ${
						COLORS.textPrimary
					}; padding: 0; margin: 0;">
                        <a href="tel:${escapeHtml(
							formData.phone.replace(/\s/g, "")
						)}" style="color: ${
		COLORS.link
	}; text-decoration: none;">${escapeHtml(formData.phone)}</a>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td style="padding: 0;">
            <table cellpadding="0" cellspacing="0" border="0">
                ${logoSection}
                ${CONFIG.features.showWebsiteUrl ? `
                <tr>
                    <td style="font-size: 13px; line-height: 1.5; color: ${
						COLORS.textMuted
					}; padding: 12px 0 0 0;">
                        <img src="${imagePath}/web@2x.png" alt="Web" width="20" style="vertical-align: middle; margin-right: 8px;">
                        ${CONFIG.urls
							.map(
								(url) =>
									`<a href="${url.url}" style="color: ${COLORS.link}; text-decoration: none;">${url.display}</a>`
							)
							.join(
								' <span style="color: ${COLORS.textMuted}; margin: 0 8px;">•</span> '
							)}
                    </td>
                </tr>` : ""}${
					formData.notes
						? `
                <tr>
                    <td style="font-size: 12px; line-height: 1.4; color: ${
						COLORS.textMuted
					}; padding: 8px 0 0 0; font-style: italic;">
                        ${escapeHtml(formData.notes)}
                    </td>
                </tr>`
						: ""
				}
            </table>
        </td>
    </tr>
</table>`.trim();

	return signatureHTML;
}

// ============================================
// Utility Functions
// ============================================

function escapeHtml(text) {
	const div = document.createElement("div");
	div.textContent = text;
	return div.innerHTML;
}

function getFormData() {
	return {
		name: nameField.value.trim(),
		jobTitle: jobTitleField.value.trim(),
		jobTitleMaori: jobTitleMaoriField.value.trim(),
		email: emailField.value.trim(),
		phone: phoneField.value.trim(),
		notes: notesField.value.trim(),
	};
}

// ============================================
// Local Storage Functions
// ============================================

function saveFormData() {
	const formData = getFormData();
	localStorage.setItem("ifEmailSignature", JSON.stringify(formData));
}

function loadFormData() {
	const saved = localStorage.getItem("ifEmailSignature");
	if (saved) {
		try {
			const formData = JSON.parse(saved);
			nameField.value = formData.name || "";
			jobTitleField.value = formData.jobTitle || "";
			jobTitleMaoriField.value = formData.jobTitleMaori || "";
			emailField.value = formData.email || "";
			phoneField.value = formData.phone || "";
			notesField.value = formData.notes || "";
		} catch (e) {
			console.error("Failed to load saved form data:", e);
		}
	}
}

function updatePreview() {
	const formData = getFormData();

	// Generate preview immediately, even with empty fields
	const signatureHTML = generateSignature(formData);
	previewArea.innerHTML = signatureHTML;

	// Save to localStorage
	saveFormData();
}

function showFeedback(message, type = "success") {
	copyFeedback.textContent = message;
	copyFeedback.className = `copy-feedback show ${type}`;

	setTimeout(() => {
		copyFeedback.classList.remove("show");
	}, 3000);
}

async function copyToClipboard() {
	const formData = getFormData();
	const signatureHTML = generateSignature(formData);

	try {
		// Try using the modern Clipboard API with HTML support
		const clipboardItem = new ClipboardItem({
			"text/html": new Blob([signatureHTML], { type: "text/html" }),
			"text/plain": new Blob([signatureHTML], { type: "text/plain" }),
		});
		await navigator.clipboard.write([clipboardItem]);
		showFeedback(
			"Signature copied! Paste into your email client.",
			"success"
		);
	} catch (err) {
		// Fallback: copy to a hidden div and use execCommand
		const container = document.createElement("div");
		container.innerHTML = signatureHTML;
		container.style.position = "fixed";
		container.style.left = "-9999px";
		document.body.appendChild(container);

		const range = document.createRange();
		range.selectNodeContents(container);
		const selection = window.getSelection();
		selection.removeAllRanges();
		selection.addRange(range);

		try {
			document.execCommand("copy");
			showFeedback(
				"Signature copied! Paste into your email client.",
				"success"
			);
		} catch (err2) {
			showFeedback("Failed to copy. Please try again.", "error");
		}

		document.body.removeChild(container);
		selection.removeAllRanges();
	}
}

// ============================================
// Event Listeners
// ============================================

// Update preview on any form field change
nameField.addEventListener("input", updatePreview);
jobTitleField.addEventListener("input", updatePreview);
jobTitleMaoriField.addEventListener("input", updatePreview);
emailField.addEventListener("input", updatePreview);
phoneField.addEventListener("input", updatePreview);
notesField.addEventListener("input", updatePreview);

// Copy button
copyButton.addEventListener("click", copyToClipboard);

// Load saved data and initialize preview on page load
loadFormData();
updatePreview();
