package com.freetalk.freetalk_backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Controller
public class ApkController {

    @CrossOrigin
    @RequestMapping("/download")
    public void downloadPDFResource( HttpServletRequest request,
                                     HttpServletResponse response) {
        //If user is not authorized - he should be thrown out from here itself
        //Authorized user will download the file
//        System.out.println(request.getServletContext().getRealPath("/WEB-INF/"));
//        String dataDirectory = request.getServletContext().getRealPath("/WEB-INF/");
        Path file = Paths.get("./WEB-INF/", "freeTalk.apk");
        if (Files.exists(file)) {
            response.setContentType("application/vnd.android.package-archive");
            response.addHeader("Content-Disposition", "attachment; filename=freeTalk.apk");
            try {
                Files.copy(file, response.getOutputStream());
                response.getOutputStream().flush();
            }
            catch (IOException ex) {
                ex.printStackTrace();
            }
        }
    }
}
