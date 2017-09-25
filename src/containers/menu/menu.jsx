import React from 'react';
import styles from './menu.css';
import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;
import {getGroupTree} from '../../webapi';
import {hashHistory} from 'react-router';

export default class Menus extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {
            groups: []
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleTitleClick = this.handleTitleClick.bind(this);
    }

    componentDidMount() {
        this.load();
    }

    async load(){
        const groups = await getGroupTree();
        this.setState({groups});
    }


    handleClick(e){
        const id = e.key;
        hashHistory.push(`/home/tax-overview/tax-department/${id}`);

    }
    handleTitleClick(e){
        const id = e.key;
        hashHistory.push(`/home/tax-overview/tax-chart/${id}`);
    }
    render() {
        const {groups} = this.state;
        return (
            <Menu
                mode="inline"
                defaultOpenKeys={[groups.id]}
                className={styles.menus}
                onClick={this.handleClick}
            >
                <SubMenu key={groups.id} title={<span><Icon type="appstore" /><span>{groups.name}</span></span>} onTitleClick={this.handleTitleClick} className={styles.title}>
                    {/*{this.groupTree(groups)}*/}

                    {groups.children && groups.children.map(group =>
                    group.children.length > 0 ?
                        <SubMenu key={group.id} title={<span><Icon type="appstore" /><span>{group.name}</span></span>} onTitleClick={this.handleTitleClick}>
                            {group.children.map(group1 =>
                                group1.children.length > 0 ?
                                    <SubMenu key={group1.id} title={<span><Icon type="appstore" /><span>{group1.name}</span></span>} onTitleClick={this.handleTitleClick}>
                                        {group1.children.map(group2 =>
                                            group2.children.length > 0 ?
                                                <SubMenu key={group2.id} title={<span><Icon type="appstore" /><span>{group2.name}</span></span>} onTitleClick={this.handleTitleClick}>
                                                    {group2.children.map(group3 =>
                                                        group3.children.length > 0 ?
                                                            <SubMenu key={group3.id} title={<span><Icon type="appstore" /><span>{group3.name}</span></span>} onTitleClick={this.handleTitleClick}>
                                                                {group3.children.map(group4 =>
                                                                    group4.children.length > 0 ?
                                                                        <SubMenu key={group4.id} title={<span><Icon type="appstore" /><span>{group4.name}</span></span>} onTitleClick={this.handleTitleClick}>

                                                                        </SubMenu>
                                                                        :
                                                                        <Menu.Item key={group4.id} className={styles.title1}>{group4.name}</Menu.Item>
                                                                )}
                                                            </SubMenu>
                                                            :
                                                            <Menu.Item key={group3.id} className={styles.title1}>{group3.name}</Menu.Item>
                                                    )}
                                                </SubMenu>
                                                :
                                                <Menu.Item key={group2.id} className={styles.title1}>{group2.name}</Menu.Item>
                                        )}
                                    </SubMenu>
                                    :
                                    <Menu.Item key={group1.id} className={styles.title1}>{group1.name}</Menu.Item>
                            )}
                        </SubMenu>
                        :
                        <Menu.Item key={group.id} className={styles.title1}>{group.name}</Menu.Item>
                    )}
                </SubMenu>
            </Menu>
        );
    }
}