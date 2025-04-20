package org.example.backend.dto;

public class UserStatsUpdate
{
    private String userId;
    private int gold;
    private int level;


    public UserStatsUpdate(String userId, int gold, int level)
    {
        this.userId = userId;
        this.gold = gold;
        this.level = level;
    }

    public String getUserId()
    {
        return userId;
    }

    public void setUserId(String userId)
    {
        this.userId = userId;
    }

    public int getGold()
    {
        return gold;
    }

    public void setGold(int gold)
    {
        this.gold = gold;
    }

    public int getLevel()
    {
        return level;
    }

    public void setLevel(int level)
    {
        this.level = level;
    }
}
