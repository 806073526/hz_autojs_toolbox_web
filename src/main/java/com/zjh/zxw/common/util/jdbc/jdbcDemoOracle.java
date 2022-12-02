package com.zjh.zxw.common.util.jdbc;

public class jdbcDemoOracle {

	static final String JDBC_DRIVER = "oracle.jdbc.driver.OracleDriver";  
	static final String DB_URL = "jdbc:oracle:thin:@172.16.0.170:1521:worcl";
	static final String SQL ="insert into ccyy_ywlog (ywlsh,inparm)values(?,?)";
	   //  Database credentials
	   static final String USER = "wghis";
	   static final String PASS = "wghis";

	   /*public static void main(String[] args) {
	   Connection conn = null;
	   Statement stmt = null;
	   PreparedStatement pstmt=null;
	   try{
	      //STEP 2: Register JDBC driver
	      Class.forName(JDBC_DRIVER);

	      //STEP 3: Open a connection
	      conn = DriverManager.getConnection(DB_URL,USER,PASS);
	      pstmt = conn.prepareStatement(SQL) ;
	      //STEP 4: Execute a query
	      stmt = conn.createStatement();
	      pstmt.setString(1, "1234");
	      String abc="дк";
	      abc=new String(abc.getBytes("GBK"),"ISO_8859_1");
	      pstmt.setString(2,abc);
	      pstmt.executeUpdate();
	      pstmt.close();

	      ResultSet rs = stmt.executeQuery(SQL);
	      //STEP 5: Extract data from result set
	      while(rs.next()){
	         //Retrieve by column name
	         String last1 = rs.getString(1);
	         String last2 = rs.getString(2);
	         String last3 = rs.getString(3);
	         String last4 = rs.getString(4);
	         String last5 = rs.getString(5);
	         System.out.println(last1);
	         System.out.println(last2);
	         System.out.println(last3);
	         System.out.println(last4);
	         System.out.println(last5);
	         
	      }
	      //STEP 6: Clean-up environment
	      rs.close();
	      stmt.close();
	      conn.close();
	   }catch(SQLException se){
	      //Handle errors for JDBC
	      se.printStackTrace();
	   }catch(Exception e){
	      //Handle errors for Class.forName
	      e.printStackTrace();
	   }finally{
	      //finally block used to close resources
	      try{
	         if(stmt!=null)
	            stmt.close();
	      }catch(SQLException se2){
	      }// nothing we can do
	      try{
	         if(conn!=null)
	            conn.close();
	      }catch(SQLException se){
	         se.printStackTrace();
	      }//end finally try
	   }
	   }*/
}
