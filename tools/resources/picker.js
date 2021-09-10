callback = arguments[arguments.length - 1];

picker = document.getElementById('robocode-picker') || document.createElement('div');
picker.setAttribute('id', 'robocode-picker');
highlighted = document.querySelectorAll('[data-robocode-highlight]')[0];

function highlightElement(event) {
  var element = event.target;
  clearHighlight();
  element.setAttribute('data-robocode-highlight', '');
  highlighted = element;
}

function clearHighlight() {
  if (highlighted !== undefined) {
    highlighted.removeAttribute('data-robocode-highlight');
  }
}


function pickElement(event) {
  event.preventDefault();
  event.stopPropagation();

  try {
    var element = document.elementFromPoint(event.clientX, event.clientY);
    callback(Simmer(element));
  } finally {
    removeAll();
    document.removeEventListener('click', getSelection, true);
    document.removeEventListener('click', set, true);
    document.removeEventListener('contextmenu', contextMenuOption, true);
  }
}

function cancelPick(event) {
  var evt = event || window.event;
  if (evt.key === 'Escape' || evt.keyCode === 27) {
    removeAll();
    document.removeEventListener('contextmenu', contextMenuOption, true);
    callback();
  }
}

function removeAll() {
  document.body.removeChild(picker);
  document.removeEventListener('mousemove', highlightElement, true);
  document.removeEventListener('click', pickElement, true);
  document.removeEventListener('keydown', cancelPick, true);
  clearHighlight();
}

function set(event){
  event.preventDefault();
  event.stopPropagation();
  if (event.target.id == 'select-btn-id'){
    document.selection.setAttribute('variable_name', document.getElementById('input_text_field').value);
    callback(Simmer(document.selection));
    document.getElementById("container").remove();
  }
  else if (event.target.id == "cancel-btn-id"){
    callback();
    document.getElementById("container").remove();
  }
}

function getSelection(event){
  event.preventDefault();
  event.stopPropagation();
  document.getElementById("ctxmenu").outerHTML = '';
  document.selection.setAttribute('context-menu-option', event.target.innerText);
  if (event.target.innerText == 'Input Text When Visible'){
    if (document.selection.value == ""){
      document.selection.setAttribute('input_text', " ")
    }
    else {
      document.selection.setAttribute('input_text', document.selection.value);
    }
    callback(Simmer(document.selection));
    removeAll()
    document.removeEventListener('click', getSelection, true);
    document.removeEventListener('click', set, true);
    document.removeEventListener('contextmenu', contextMenuOption, true);
  }
  else if(event.target.innerText == 'Click Element When Visible'){
    callback(Simmer(document.selection));
    removeAll()
    document.removeEventListener('click', getSelection, true);
    document.removeEventListener('contextmenu', contextMenuOption, true);
  }
  else if(event.target.innerText == 'Store Element Text'){
    let inputPopup = document.createElement("div");
    inputPopup.id = "container";
    inputPopup.innerHTML = `<form>
                              <input id="input_text_field" class="input_text_field" type="text" name="Variable Name" placeholder="Variable Name">
                            </form>
                            <button id="select-btn-id" class="custom-select-btn">Set</button>
                            <button id="cancel-btn-id" class="custom-cancel-btn">Cancel</button>`;
    document.body.appendChild(inputPopup);
    document.getElementById("container").style = `top:${event.pageY-10}px;left:${event.pageX-10}px`;
    document.addEventListener('click', set, true);
    removeAll()
    document.removeEventListener('click', getSelection, true);
    document.removeEventListener('contextmenu', contextMenuOption, true);
  }
  else{
    callback()
    removeAll()
    document.removeEventListener('click', getSelection, true);
    document.removeEventListener('contextmenu', contextMenuOption, true);
    document.body.removeChild(customContextMenu);
  }
}

function contextMenuOption(event){
  event.preventDefault();
  event.stopPropagation();
  document.selection = document.elementFromPoint(event.clientX, event.clientY);
  document.removeEventListener('click', pickElement, true);
  document.removeEventListener('mousemove', highlightElement, true);
  let customContextMenu = document.createElement("div");
  customContextMenu.id = "ctxmenu";
  customContextMenu.style = `top:${event.pageY-5}px;left:${event.pageX-5}px`;
  customContextMenu.innerHTML = "<p>Input Text When Visible</p><p>Click Element When Visible</p><p>Store Element Text</p>";
  document.body.appendChild(customContextMenu);
  document.addEventListener('click', getSelection, true);
  document.removeEventListener('contextmenu', contextMenuOption, true);
}

clearHighlight();
document.addEventListener('mousemove', highlightElement, true);
document.addEventListener('click', pickElement, true);
document.addEventListener('keydown', cancelPick, true);
document.addEventListener('contextmenu', contextMenuOption, true);
document.body.appendChild(picker);

