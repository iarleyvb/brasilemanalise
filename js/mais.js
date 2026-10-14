/* "+ Ler mais": textos longos ficam recolhidos em 3 linhas, com botão para abrir.
   Vale em todas as páginas; só aparece quando o texto realmente não cabe. */
(function () {
  "use strict";
  var W = window, D = document;
  var SEL = ".page .dek, .page .lead, .page .note, .page .hr-sub, .page .hr-note, .page .hxvs";
  var n = 0, agenda = null;

  function dentroDeDetalhes(e) {
    var p = e.parentNode;
    while (p && p !== D.body) { if (p.tagName === "DETAILS" || (p.className && /(^| )(sb|cr|gu|qz|dq)-/.test(p.className))) { return true; } p = p.parentNode; }
    return false;
  }

  function preparar(e) {
    var b = e.__maisBtn, aberto = e.getAttribute("data-mais") === "aberto";
    if (e.offsetParent === null) { return; }
    if (!b) {
      e.classList.add("mx");
      if (e.scrollHeight <= e.clientHeight + 2) { e.classList.remove("mx"); return; }
      n += 1;
      if (!e.id) { e.id = "mx-" + n; }
      b = D.createElement("button");
      b.type = "button"; b.className = "mx-btn";
      b.setAttribute("aria-controls", e.id);
      b.addEventListener("click", function () {
        var ab = e.getAttribute("data-mais") !== "aberto";
        e.setAttribute("data-mais", ab ? "aberto" : "fechado");
        e.classList.toggle("mx", !ab);
        b.setAttribute("aria-expanded", ab ? "true" : "false");
        b.firstChild.nodeValue = ab ? "− Ler menos" : "+ Ler mais";
      });
      b.appendChild(D.createTextNode("+ Ler mais"));
      b.setAttribute("aria-expanded", "false");
      e.setAttribute("data-mais", "fechado");
      e.parentNode.insertBefore(b, e.nextSibling);
      e.__maisBtn = b;
    } else if (!aberto) {
      e.classList.add("mx");
      b.hidden = e.scrollHeight <= e.clientHeight + 2;
      if (b.hidden) { e.classList.remove("mx"); }
    }
  }

  function varrer() {
    agenda = null;
    var l = D.querySelectorAll(SEL), i;
    for (i = 0; i < l.length; i++) { if (!dentroDeDetalhes(l[i])) { try { preparar(l[i]); } catch (x) { } } }
  }
  function marcar() { if (agenda) { return; } agenda = W.requestAnimationFrame ? W.requestAnimationFrame(varrer) : W.setTimeout(varrer, 60); }

  function iniciar() {
    marcar();
    W.addEventListener("hashchange", function () { W.setTimeout(marcar, 120); });
    W.addEventListener("resize", marcar);
    if (W.MutationObserver) {
      new W.MutationObserver(function (m) {
        var i; for (i = 0; i < m.length; i++) { if (!(m[i].target.className + "").match(/mx-btn/)) { W.setTimeout(marcar, 200); return; } }
      }).observe(D.querySelector("main") || D.body, { childList: true, characterData: true, subtree: true });
    }
    W.setTimeout(marcar, 900);
  }
  if (D.readyState === "loading") { D.addEventListener("DOMContentLoaded", iniciar); } else { iniciar(); }
})();
