document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // останавливает стандартный submit (очень важно!)

    status.textContent = "Отправка...";

    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        status.textContent = "Сообщение отправлено!";
        form.reset();
      } else {
        status.textContent = "Ошибка: " + result.error;
      }
    } catch (err) {
      status.textContent = "Ошибка сети: " + err.message;
    }
  });
});
