package com.zjh.zxw.base;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.*;
import lombok.experimental.Accessors;

/**
 * @ClassName MyPage
 * @Date 2020/7/16 11:48
 * @Version 1.0
 */
@Data
@NoArgsConstructor
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class MyPage<T> {
    private Page<T> page;
    private T query;

    @Builder
    public MyPage(Page<T> page, T query) {
        this.page = page;
        this.query = query;
    }
}
