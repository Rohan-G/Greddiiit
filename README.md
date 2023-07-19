# Greddiit

#### <b>Note:</b> docker compose does not work on my machine, so I haven't tested with it. docker-compose v1.29.2 works fina and was what was used to run the docker files. Command to run it:
```
sudo docker-compose up --build
```

### Implemented most features except for the stats page (clicking on the icon will cause a black screen which can be regained using the back icon).

### Implemented 2 bonuses - Image Upload and Fuzzy Search. Image upload is optional and if not uploaded the default image is displayed. Image size limit is 50kB.

### Assumed username is uneditable - like the actual reddit app.

### Error messages are displayed as an alert (Well, all messages are).

### Assuming Navbar doesn't change in the all subgreddiits page.

### Assuming you cannot enter a subReddit if you're not part of it.

### Implemented input validation for tags and banned keywords.

### Implemented API call authorization checking.

### Assuming dockerization doesn't include nginx since it was not mentioned on moodle or the document
