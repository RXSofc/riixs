document.addEventListener('DOMContentLoaded', () => {
  const prankBtn = document.getElementById("prankBtn");

  prankBtn.addEventListener("click", () => {
    document.body.classList.add("glitch");
    setTimeout(() => document.body.classList.remove("glitch"), 500);

    const sound = new Audio("https://www.myinstants.com/media/sounds/trollolol.mp3");
    sound.play().catch(() => {});

    const messages = [
      "😈 Gotcha!",
      "💀 System error... just kidding.",
      "⚡ You’ve been voided!",
      "👾 EvilVoid strikes again!",
      "😜 Relax, it’s just a prank!"
    ];
    alert(messages[Math.floor(Math.random() * messages.length)]);
  });
});