package in.vamsee.webreader;

import android.app.Activity;
import android.os.Bundle;
import android.database.Cursor;
import android.content.ContentValues;
import android.content.ContentResolver;
import android.net.Uri;
import android.widget.Toast;
import android.widget.CheckBox;
import android.view.View;
import android.view.View.OnClickListener;

public class WebReader extends Activity {
    private static final String TAG = "***WebReader***";

    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);

	final CheckBox checkbox = (CheckBox) findViewById(R.id.checkbox);
	checkbox.setOnClickListener(new OnClickListener() {
		public void onClick(View v) {
		    // Perform action on clicks
		    if (checkbox.isChecked()) {
			if (!isBookmarkPresent()) {
			    addBookmark();
			}
			Toast.makeText(WebReader.this, "Bookmark added", Toast.LENGTH_SHORT).show();
		    } else {
			removeBookmark();
			Toast.makeText(WebReader.this, "Bookmark removed", Toast.LENGTH_SHORT).show();
		    }
		}
	    });

	if (isBookmarkPresent()) {
	    checkbox.setChecked(true);
	} else {
	    Toast.makeText(WebReader.this, "WebReader bookmark not installed yet. Click the checkbox to do so.", Toast.LENGTH_LONG).show();
	}
    }

    protected void addBookmark() {
	ContentValues inputValues = new ContentValues();

	inputValues.put(android.provider.Browser.BookmarkColumns.BOOKMARK, "1");
	inputValues.put(android.provider.Browser.BookmarkColumns.URL, "javascript:(function(){_webreader_script=document.createElement('SCRIPT');_webreader_script.type='text/javascript';_webreader_script.src='http://wrcdn.vamsee.in/wrmin.js?x='+(Math.random());document.getElementsByTagName('head')[0].appendChild(_webreader_script);_webreader_css=document.createElement('LINK');_webreader_css.rel='stylesheet';_webreader_css.href='http://wrcdn.vamsee.in/wrmin.css';_webreader_css.type='text/css';_webreader_css.media='screen';document.getElementsByTagName('head')[0].appendChild(_webreader_css);})();");
	inputValues.put(android.provider.Browser.BookmarkColumns.TITLE, "WebReader");
	
	ContentResolver cr = getContentResolver();
	Uri uri = cr.insert(android.provider.Browser.BOOKMARKS_URI, inputValues);
    }

    protected void removeBookmark() {
	ContentResolver cr = getContentResolver();
	cr.delete(android.provider.Browser.BOOKMARKS_URI, "title = ?", new String[] { "WebReader" });
    }

    protected boolean isBookmarkPresent() {
	String[] proj = new String[] { 
	    android.provider.Browser.BookmarkColumns.TITLE,
	};

	Cursor bookmarks = managedQuery(android.provider.Browser.BOOKMARKS_URI, proj, "bookmark = 1", null,
					android.provider.Browser.BookmarkColumns.URL + " ASC");
	
	if (bookmarks.moveToFirst()) {
	    int titleColumn = bookmarks.getColumnIndex(android.provider.Browser.BookmarkColumns.TITLE);
	    
	    do {
		if (bookmarks.getString(titleColumn).equals("WebReader")) {
		    return true;
		}
	    } while (bookmarks.moveToNext());		    
	}

	return false;
    }
}
