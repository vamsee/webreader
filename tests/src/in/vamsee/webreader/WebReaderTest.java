package in.vamsee.webreader;

import android.test.ActivityInstrumentationTestCase;

/**
 * This is a simple framework for a test of an Application.  See
 * {@link android.test.ApplicationTestCase ApplicationTestCase} for more information on
 * how to write and extend Application tests.
 * <p/>
 * To run this test, you can type:
 * adb shell am instrument -w \
 * -e class in.vamsee.webreader.WebReaderTest \
 * in.vamsee.webreader.tests/android.test.InstrumentationTestRunner
 */
public class WebReaderTest extends ActivityInstrumentationTestCase<WebReader> {

    public WebReaderTest() {
        super("in.vamsee.webreader", WebReader.class);
    }

}
