from RPA.core import webdriver
from subprocess import call
import os
import platform
from typing import Dict, Optional, Tuple, Any
import pkg_resources
from tools.locator_protocols import (
    BrowserLocatorTypedDict,
)
from selenium.common.exceptions import (
    InvalidSessionIdException,
    JavascriptException,
    NoSuchWindowException,
    TimeoutException,
)

def load_resource(filename):
    with pkg_resources.resource_stream(__name__, filename) as fd:
        return fd.read().decode("utf-8")

class WebdriverError(Exception):
    """Common exception for all webdriver errors."""

class Webdriver:

    def __init__(self):

        self._headless = True
        self._driver = None
        self._snippets: Dict[str, str] = {
            "simmer": load_resource("./resources/simmer.js"),
            "style": load_resource("./resources/style.js"),
            "picker": load_resource("./resources/picker.js"),
        }
        self.execution_queue = list()

    @property
    def url(self) -> str:
        return self._driver.current_url
        
    def _inject_requirements(self) -> None:
        if not self._driver.find_elements_by_css_selector(
            'style[data-name="robocode"]'
        ):
            self._driver.execute_script(self._snippets["simmer"])
            self._driver.execute_script(self._snippets["style"])

    def _execute_func(self, func, *args, **kwargs):
        def error(msg):
            self.logger.warning(msg)
            raise WebdriverError(msg)

        if not self._driver:
            error("No available webdriver")

        try:
            self._inject_requirements()
            return func(*args, **kwargs)
        except TimeoutException:
            error("Timeout while running script")
        except JavascriptException as exc:
            error("Error while running script: {}".format(exc))
        except WebdriverError as exc:
            error("Webdriver error: {}".format(exc))
        except (InvalidSessionIdException, NoSuchWindowException) as exc:
            self._driver = None
            error(exc)
        except Exception as exc:
            self._driver = None
            raise

    def _create_driver(self):
        browsers = webdriver.DRIVER_PREFERENCE[platform.system()]
        for browser in browsers:
            kwargs = {}
            if self._headless:
                from selenium.webdriver import ChromeOptions
                chrome_options = ChromeOptions()
                chrome_options.add_experimental_option('excludeSwitches', ['enable-logging'])
                kwargs["options"] = chrome_options

            for download in [False, True]:
                if hasattr(webdriver, "executable"):  # old version
                    executable = webdriver.executable(browser, download=download)
                else:
                    # new version
                    if not download:
                        executable = webdriver.cache(browser)
                        if not executable:
                            continue
                    else:
                        executable = webdriver.download(browser)
                try:
                    if executable:
                        driver = webdriver.start(
                            browser, executable_path=executable, **kwargs
                        )
                    else:
                        driver = webdriver.start(browser, **kwargs)

                    return driver, browser
                except Exception as e:
                    print(
                        "Error trying to start with executable: %s", executable
                    )

        raise ValueError("No valid browser found")
    def start(self):
        self._driver, browser = self._create_driver()
        self._driver.set_script_timeout(3600)

    def navigate(self, url):
        self._driver.get(url)

    def pick(self) -> Tuple[Optional[Any], Optional[str], Optional[str]]:
        def pick():
            selector = self._driver.execute_async_script(self._snippets["picker"])
            if selector:
                print(selector)
            else:
                print('Unavailable element!')
            if not selector:
                return None, None, None

            element = self._driver.find_element_by_css_selector(selector)

            finders = (
                ("id", self._driver.find_elements_by_id),
                ("name", self._driver.find_elements_by_name),
                ("link", self._driver.find_elements_by_link_text),
                ("class", self._driver.find_elements_by_class_name),
                ("tag", self._driver.find_elements_by_tag_name),
            )

            for attribute_name, finder in finders:
                attribute = element.get_attribute(attribute_name)
                if attribute:
                    matches = finder(attribute)
                    if len(matches) == 1 and matches[0] == element:
                        return element, attribute_name, attribute

            return element, "css", selector
        return self._execute_func(pick)

    def pick_as_browser_locator_dict(self) -> BrowserLocatorTypedDict:

        element, strategy, value = self.pick()
        response: BrowserLocatorTypedDict = {
            "strategy": strategy,
            "value": value,
            "source": self.url,
            "type": "browser",
        }
        if element is None:
            return response
        if element.get_attribute('context-menu-option') == 'Input Text When Visible':
            self.execution_queue.append(('input_text_when_element_is_visible', element.get_attribute('input_text'), response))
        elif element.get_attribute('context-menu-option') == 'Click Element When Visible':
            self.execution_queue.append(('click_element_when_visible', None, response))
        elif element.get_attribute('context-menu-option') == 'Store Element Text':
            self.execution_queue.append(('get_text', element.get_attribute('variable_name'), response))
        return response
    
    def display_queue(self):
        def format(a, b, c, d):
            return '{:<10}  {:<40}  {:<20} {:<25}'.format(a,b,c,d)
        print(format('Step', 'Action', 'Value', 'Element'))
        if not self.execution_queue:
            print(format('None', 'None', 'None', 'None'))
        else:
            for step, (action, value, element) in enumerate(self.execution_queue):
                if not value:
                    value = 'None'
                element_str = f"Strategy: {element['strategy']}, Value: {element['value']}"[:25]
                if len(element_str)>25:
                    element_str[:22] + '...'
                print(format(step, action, value, element_str))
        print()

    def display_selection(self):
        response = self.pick_as_browser_locator_dict()
        if response['strategy'] is None and response['value'] is None:
            return
        else:
            print(response)
    
    def delete_execution_from_queue(self):
        self.display_queue()
        step = input("Enter step to be deleted:")
        try:
            self.execution_queue.pop(int(step))
        except:
            pass
        self.display_queue()
    
    def delete_latest_execution_from_queue(self):
        self.display_queue()
        print("""Dropping latest execution step...
        """)
        try:
            self.execution_queue.pop(-1)
        except:
            pass
        self.display_queue()