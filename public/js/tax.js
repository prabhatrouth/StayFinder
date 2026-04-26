const toggle = document.getElementById("taxToggle");

toggle.addEventListener("change", () => {
  const prices = document.querySelectorAll(".price");

  prices.forEach(p => {
    let base = parseInt(p.dataset.price);

    if (toggle.checked) {
      let total = Math.round(base * 1.18);
      p.innerText = `₹${total.toLocaleString("en-IN")} (incl. tax)`;
    } else {
      p.innerText = `₹${base.toLocaleString("en-IN")} / night`;
    }
  });
});