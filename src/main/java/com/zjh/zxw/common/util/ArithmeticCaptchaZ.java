package com.zjh.zxw.common.util;

import com.wf.captcha.base.ArithmeticCaptchaAbstract;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ArithmeticCaptchaZ extends ArithmeticCaptchaAbstract {

    public List<Map<String,String>> list = new ArrayList<>();

    public ArithmeticCaptchaZ() {
    }

    public ArithmeticCaptchaZ(int width, int height) {
        this();
        this.setWidth(width);
        this.setHeight(height);
    }

    public ArithmeticCaptchaZ(int width, int height, int len) {
        this(width, height);
        this.setLen(len);
    }

    public ArithmeticCaptchaZ(int width, int height, int len, Font font) {
        this(width, height, len);
        this.setFont(font);
    }

    public boolean out(OutputStream out) {
        this.checkAlpha();
        return this.graphicsImage(this.getArithmeticString().toCharArray(), out);
    }

    public List<Map<String,String>> getList(){
        return  this.list;
    }

    public String toBase64() {
        return this.toBase64("data:image/png;base64,");
    }

    private boolean graphicsImage(char[] strs, OutputStream out) {
        try {
            BufferedImage bi = new BufferedImage(this.width, this.height, 1);
            Graphics2D g2d = (Graphics2D)bi.getGraphics();
            g2d.setColor(Color.WHITE);
            g2d.fillRect(0, 0, this.width, this.height);
            g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            this.drawOval(2, g2d);
            g2d.setFont(this.getFont());
            FontMetrics fontMetrics = g2d.getFontMetrics();
            int fW = this.width / strs.length;
            int fSp = (fW - (int)fontMetrics.getStringBounds("8", g2d).getWidth()) / 2;

            for(int i = 0; i < strs.length; ++i) {
                g2d.setColor(this.color());
                int fY = this.height - (this.height - (int)fontMetrics.getStringBounds(String.valueOf(strs[i]), g2d).getHeight() >> 1);
                String curText = String.valueOf(strs[i]);
                int x = i * fW + fSp + 3;
                int y = fY - 3;
                g2d.drawString(String.valueOf(strs[i]), x, y);

                Map<String,String> curMap = new HashMap<>();
                curMap.put("text", curText);
                curMap.put("x", String.valueOf(x));
                curMap.put("y", String.valueOf(y));
                this.list.add(curMap);
            }
            g2d.dispose();
            ImageIO.write(bi, "png", out);
            out.flush();
            boolean var20 = true;
            return var20;
        } catch (IOException var18) {
            var18.printStackTrace();
        } finally {
            try {
                out.close();
            } catch (IOException var17) {
                var17.printStackTrace();
            }

        }

        return false;
    }
}
