document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // останавливаем перезагрузку страницы

    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        alert("Сообщение отправлено!");
        form.reset();
      } else {
        alert("Ошибка: " + result.error);
      }
    } catch (err) {
      alert("Ошибка сети: " + err.message);
    }
  });
});
