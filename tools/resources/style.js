var node = document.createElement('style');

node.setAttribute('data-name', 'robocode');
node.innerHTML = `
[data-robocode-highlight] {
  outline: 2px solid #7158F1 !important;
  opacity: 1.0 !important;
}
#robocode-picker {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  cursor: crosshair;
  pointer-events: none;
  box-shadow: inset 0px 0px 0px 5px #7158F1;
}
#robocode-picker::after {
  position: fixed;
  content: "Right click element to select options";
  font-size: 16px;
  text-align: center;
  bottom: 0;
  left: 50%;
  width: 300px;
  margin-left: -150px;
  padding: 5px;
  color: white;
  background: #7158F1;
  opacity: 1.0;
}
#ctxmenu {
  position: absolute;
  background:ghostwhite;
  color: black;
  cursor: pointer;
  border: 1px black solid;
  z-index: 99999 !important; 
}
#ctxmenu > p {
  padding: 0 1rem;
  margin: 0
}
#ctxmenu > p:hover {
  background: black;
  color: ghostwhite
}
#container{
  position: absolute;
  height: 20%;     
  width: 20%;
  border-radius: 5px;
  background-color: rgb(169,169,169);
  box-shadow: 0px 0px 12px #000;
  z-index: 99999 !important;
  }
.input_text_field{
  position: absolute;
  top:20px;
  left:20px;
  width:75%;
  height:20%;
}
.custom-select-btn{
  position: absolute;
  top:60px;
  left:55%;
  width:30%;
  height:30%;
  color: white;
  background-color: #555555;
  border-radius: 35%;
  z-index: 99999 !important;
  font-size: 80%;
  }
.custom-select-btn:hover{
  opacity: 0.7;
  }
.custom-cancel-btn{
  position: absolute;
  top:60px;
  left:10%;
  width:30%;
  height:30%;
  color: white;
  background-color: #555555;
  border-radius: 35%;
  z-index: 99999 !important;
  font-size: 80%;
  }
.custom-cancel-btn:hover{
  opacity: 0.7;
  }
`;

document.head.appendChild(node);