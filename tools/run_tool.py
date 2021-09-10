from dataclasses import dataclass
from tools.tool import *
import os 
from datetime import datetime
import time
import keyboard
import yaml

@dataclass
class RunTool:
    def __post_init__(self):
        self._get_config()
        self.w = Webdriver()
        self.w.start()
        self.w.navigate(self.url)
        print("Loading...")
        self.args = ""

    def _get_config(self):
        with open(r'./config.yaml') as file:
            parser = yaml.load(file, Loader=yaml.FullLoader)
        self.url = parser['STARTUP URL']
        self.generate = parser['AUTO GENERATE SCRIPTS']  

    def _set_element_framework(self):
        elements = ""
        for i, queue in enumerate(self.w.execution_queue):
            elements += f"element{i} = {queue[2]}\n    "
        elements_framework = f"""
class BaseElements:
    {elements}
        """
        with open(f"./{self.current_time}/elements.py", "w") as f:
            f.write(elements_framework)


    def _set_object_framework(self):
        inputs = ""
        actions = ""
        index = 0
        element_index = 0
        for i, queue in enumerate(self.w.execution_queue):
            initial = '' if i==0 else ','
            if queue[1]:
                self.args += f"{initial}'{queue[1]}'"
                inputs = inputs + f"arg{index}: str \n    " 
            if queue[0] == 'input_text_when_element_is_visible':
                actions = actions + f"self.driver.{queue[0]}(self._get_selector(BaseElements.element{element_index}['strategy'], BaseElements.element{element_index}['value']), self.arg{index})\n        "
                index+=1
            elif queue[0] == 'get_text':
                actions = actions + f"self.data[self.arg{index}] = self.driver.{queue[0]}(self._get_selector(BaseElements.element{element_index}['strategy'], BaseElements.element{element_index}['value']))\n        "
            else:
                actions = actions + f"self.driver.{queue[0]}(self._get_selector(BaseElements.element{element_index}['strategy'], BaseElements.element{element_index}['value']))\n        "
            element_index+=1
        actions = actions + "self._store_data_to_file()\n        "
        objects_framework = f"""
from RPA.Browser.Selenium import Selenium
from typing import Any
from dataclasses import dataclass, field
from elements import *
import json

@dataclass
class Base:
    {inputs}
    driver: Any = field(default=Selenium(), init=False)
    global_selenium_time_out: int = 25

    def __post_init__(self):
        self.data = dict()
        self.driver.set_selenium_implicit_wait(self.global_selenium_time_out)
        self.driver.open_available_browser('{self.url}')
        self.driver.maximize_browser_window()

    def _get_selector(self, strategy, value):
        return f"{{strategy}}:{{value}}"
    
    def _store_data_to_file(self):
        with open("./{self.current_time}/data.json", "w") as f:
            json.dump(self.data, f)

    def action(self):
        {actions}

    def tear_down(self):
        self.driver.close_browser()
        """
        with open(f"./{self.current_time}/objects.py", "w") as f:
            f.write(objects_framework)

    def _set_process_framework(self):

        process_framework = f"""
from objects import *
import time

def main():
    try:
        base = Base({self.args})
        base.action()
        
    except Exception as e:
        raise Exception(e)
    finally:
        time.sleep(3)
        base.tear_down()

if __name__ == "__main__":
    main()
        """
        with open(f"./{self.current_time}/process.py", "w") as f:
            f.write(process_framework)

    def _is_browser_not_closed(self) -> bool: 
        try:
            self.w._driver.title
        except Exception as e:
            return False
        return True
    
    def _generate_execution_scripts(self):
        self.current_time = str(datetime.now()).replace('.','_').replace(' ','_').replace(':','-')
        os.mkdir(f"./{self.current_time}")
        self._set_element_framework()
        self._set_object_framework()
        self._set_process_framework()
            

    def embed_hotkey_features(self):
        print("""
        Press Control to start spying elements
        Right click element on screen to select options
        Press Alt to display current execution queue
        Press Shift + 1 to select execution step to be dropped
        Press Shift + 2 to drop latest execution step
        Press Shift + 3 to close browser
        Press Shift + 4 to generate process
        """)
        keyboard.add_hotkey("Control", lambda: self.w.display_selection())
        keyboard.add_hotkey("Alt", lambda: self.w.display_queue())
        keyboard.add_hotkey("Shift+F1", lambda: self.w.delete_execution_from_queue())
        keyboard.add_hotkey("Shift+F2", lambda: self.w.delete_latest_execution_from_queue())
        should_sleep = True
        while should_sleep:
            should_sleep = self._is_browser_not_closed()
            if keyboard.is_pressed("Shift+F3"):
                self.w._driver.close()
                should_sleep = False
            if keyboard.is_pressed("Shift+F4"):
                self.generate = False
                self._generate_execution_scripts()
                time.sleep(2)
        if self.generate:
            self._generate_execution_scripts()