(function () {
  "use strict";

  /* ====== config ====== */
  var LAUNCH = new Date("2027-07-10T16:00:00+08:00"); // hari-H Lambefest (Summer 2027, Bali)
  var STORE_KEY = "lambefest-notify-email";
  var CAL_TITLE = "LAMBEFEST — Festival Musik dari Lambe";
  var CAL_DETAILS =
    "Spill The Beat. Feel The Heat. Festival musik Lambefest di Nuanu, Bali. " +
    "Kunjungi lambefest.com untuk info tiket & lineup.";
  var CAL_LOCATION = "Nuanu, Bali, Indonesia";
  var NOTIFY_ENDPOINT = "https://formsubmit.co/ajax/asraffahruddin741@gmail.com";
  var NOTIFY_SUBJECT = "[lambefest.com] Email baru dari landing page";

  /* ====== google calendar "set reminder" ====== */
  function gcalStamp(d) {
    return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  }

  var calLink = document.getElementById("cal-link");
  if (calLink) {
    var end = new Date(LAUNCH.getTime() + 3 * 60 * 60 * 1000);
    calLink.href =
      "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent(CAL_TITLE) +
      "&dates=" + gcalStamp(LAUNCH) + "/" + gcalStamp(end) +
      "&details=" + encodeURIComponent(CAL_DETAILS) +
      "&location=" + encodeURIComponent(CAL_LOCATION);
  }

  /* ====== notify form ====== */
  var form = document.getElementById("notify-form");
  var input = document.getElementById("email");
  var err = document.getElementById("notify-err");
  var done = document.getElementById("notify-done");
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showDone() {
    form.hidden = true;
    err.hidden = true;
    done.hidden = false;
  }

  try {
    if (localStorage.getItem(STORE_KEY)) showDone();
  } catch (e) { /* localStorage unavailable */ }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var value = input.value.trim();

    if (!EMAIL_RE.test(value)) {
      err.hidden = false;
      form.classList.remove("shake");
      void form.offsetWidth;
      form.classList.add("shake");
      input.focus();
      return;
    }

    try { localStorage.setItem(STORE_KEY, value); } catch (e) { /* ignore */ }
    showDone();

    /* Fire-and-forget: kirim email notifikasi ke pemilik situs.
       Gagal/kirim ulang tidak mengubah UX — status "selesai" sudah tampil. */
    if (window.fetch) {
      fetch(NOTIFY_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email: value,
          sumber: "lambefest.com",
          _subject: NOTIFY_SUBJECT,
          _template: "table",
          _captcha: "false",
        }),
      }).catch(function () { /* ignore */ });
    }
  });
})();
